import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

bandwidth = ctrl.Antecedent(np.arange(0, 11, 1), 'bandwidth')
buffer = ctrl.Antecedent(np.arange(0, 11, 1), 'buffer')
delay = ctrl.Antecedent(np.arange(0, 301, 10), 'delay')
bitrate = ctrl.Consequent(np.arange(144, 1081, 72), 'bitrate')

bandwidth['low'] = fuzz.trimf(bandwidth.universe, [0, 0, 4])
bandwidth['medium'] = fuzz.trimf(bandwidth.universe, [3, 5, 7])
bandwidth['high'] = fuzz.trimf(bandwidth.universe, [6, 10, 10])

buffer['empty'] = fuzz.trimf(buffer.universe, [0, 0, 3])
buffer['half'] = fuzz.trimf(buffer.universe, [2, 5, 8])
buffer['full'] = fuzz.trimf(buffer.universe, [7, 10, 10])

delay['low'] = fuzz.trimf(delay.universe, [0, 0, 100])
delay['moderate'] = fuzz.trimf(delay.universe, [50, 150, 250])
delay['high'] = fuzz.trimf(delay.universe, [200, 300, 300])

bitrate['very_low'] = fuzz.trimf(bitrate.universe, [144, 144, 360])
bitrate['low'] = fuzz.trimf(bitrate.universe, [288, 480, 720])
bitrate['medium'] = fuzz.trimf(bitrate.universe, [540, 720, 900])
bitrate['high'] = fuzz.trimf(bitrate.universe, [720, 1080, 1080])

rule1 = ctrl.Rule(bandwidth['high'] & delay['low'] & buffer['full'], bitrate['high'])
rule2 = ctrl.Rule(bandwidth['low'] | delay['high'] | buffer['empty'], bitrate['very_low'])
rule3 = ctrl.Rule(bandwidth['medium'] & buffer['half'], bitrate['medium'])
rule4 = ctrl.Rule(delay['high'] & buffer['empty'], bitrate['very_low'])

bitrate_ctrl_system = ctrl.ControlSystem([rule1, rule2, rule3, rule4])
bitrate_simulator = ctrl.ControlSystemSimulation(bitrate_ctrl_system)

@app.route('/get-bitrate', methods=['POST'])
def get_fuzzy_bitrate():
    try:
        data = request.json
        bitrate_simulator.input['bandwidth'] = data['bandwidth']
        bitrate_simulator.input['buffer'] = data['buffer']
        bitrate_simulator.input['delay'] = data['delay']
        bitrate_simulator.compute()

        if 'bitrate' not in bitrate_simulator.output:
            return jsonify({'bitrate': 360})

        crisp_output = bitrate_simulator.output['bitrate']
        return jsonify({'bitrate': round(crisp_output, 2)})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
