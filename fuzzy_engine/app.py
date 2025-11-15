import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)

bandwidth = ctrl.Antecedent(np.arange(0, 11, 1), 'bandwidth')
buffer = ctrl.Antecedent(np.arange(0, 11, 1), 'buffer')
delay = ctrl.Antecedent(np.arange(0, 401, 1), 'delay')
bitrate = ctrl.Consequent(np.arange(144, 1081, 1), 'bitrate')

bandwidth['low'] = fuzz.trimf(bandwidth.universe, [0, 0, 4])
bandwidth['medium'] = fuzz.trimf(bandwidth.universe, [3, 5, 7])
bandwidth['high'] = fuzz.trimf(bandwidth.universe, [6, 10, 10])

buffer['empty'] = fuzz.trimf(buffer.universe, [0, 0, 3])
buffer['half'] = fuzz.trimf(buffer.universe, [2, 5, 8])
buffer['full'] = fuzz.trimf(buffer.universe, [7, 10, 10])

delay['very_low'] = fuzz.trapmf(delay.universe, [0, 0, 25, 50])
delay['low'] = fuzz.trimf(delay.universe, [40, 80, 120])
delay['moderate'] = fuzz.trimf(delay.universe, [110, 160, 210])
delay['high'] = fuzz.trimf(delay.universe, [190, 270, 350])
delay['spike'] = fuzz.trapmf(delay.universe, [330, 370, 400, 400])

bitrate['panic'] = fuzz.trimf(bitrate.universe, [144, 144, 240])
bitrate['low'] = fuzz.trimf(bitrate.universe, [240, 360, 480])
bitrate['medium'] = fuzz.trimf(bitrate.universe, [480, 720, 840])
bitrate['high'] = fuzz.trimf(bitrate.universe, [840, 1080, 1080])

rule1 = ctrl.Rule(delay['spike'], bitrate['panic'])
rule2 = ctrl.Rule(buffer['empty'] | bandwidth['low'], bitrate['low'])
rule3 = ctrl.Rule(delay['high'], bitrate['low'])
rule4 = ctrl.Rule(bandwidth['medium'] & buffer['half'] & (delay['very_low'] | delay['low'] | delay['moderate']), bitrate['medium'])
rule5 = ctrl.Rule(bandwidth['high'] & buffer['full'] & (delay['very_low'] | delay['low']), bitrate['high'])
rule6 = ctrl.Rule(bandwidth['high'] & buffer['half'] & (delay['very_low'] | delay['low']), bitrate['medium'])
rule7 = ctrl.Rule(bandwidth['medium'] & delay['high'], bitrate['low'])

bitrate_ctrl_system = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7])
bitrate_simulator = ctrl.ControlSystemSimulation(bitrate_ctrl_system)

logging.basicConfig(level=logging.INFO)

@app.route('/get-bitrate', methods=['POST'])
def get_fuzzy_bitrate():
    try:
        data = request.json
        
        bw_input = max(0, min(10, data['bandwidth']))
        buf_input = max(0, min(10, data['buffer']))
        del_input = max(0, min(400, data['delay']))

        bitrate_simulator.input['bandwidth'] = bw_input
        bitrate_simulator.input['buffer'] = buf_input
        bitrate_simulator.input['delay'] = del_input
        
        bitrate_simulator.compute()

        crisp_output = 360
        if 'bitrate' in bitrate_simulator.output:
            crisp_output = bitrate_simulator.output['bitrate']
        
        log_data = {
            "inputs": {
                "bandwidth": bw_input,
                "buffer": buf_input,
                "delay": del_input
            },
            "output_bitrate": round(crisp_output, 2)
        }
        app.logger.info(log_data)

        return jsonify({'bitrate': round(crisp_output, 2)})

    except Exception as e:
        app.logger.error(f"Error in fuzzy computation: {str(e)}")
        return jsonify({'error': str(e), 'bitrate': 360}), 500

@app.route('/rules', methods=['GET'])
def get_rules():
    try:
        all_rules = [str(rule) for rule in bitrate_ctrl_system.rules]
        return jsonify({
            "rule_count": len(all_rules),
            "rules": all_rules
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
