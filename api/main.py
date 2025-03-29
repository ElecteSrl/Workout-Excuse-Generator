from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import random
from urllib.parse import parse_qs

EXCUSES = {
    "running": [
        "my shoes are having an existential crisis",
        "I saw a weather forecast from a parallel universe where it's raining",
        "I'm saving my energy for professional couch surfing",
    ],
    "weightlifting": [
        "the weights looked at me funny",
        "my muscles are on a meditation retreat",
        "gravity is particularly strong today",
    ],
    "yoga": [
        "my chakras are already perfectly aligned... probably",
        "my yoga mat is practicing social distancing",
        "my zen is at maximum capacity",
    ],
    "swimming": [
        "the water molecules requested a day off",
        "my swimsuit is attending a fashion show",
        "I'm allergic to chlorine today only",
    ],
    "cycling": [
        "my bike is having a quarter-life crisis",
        "the wind is too aerodynamic today",
        "my pedals are practicing mindfulness",
    ],
    "HIIT": [
        "my intervals need a interval",
        "my high intensity is feeling rather low",
        "my burpees have burped their last",
    ]
}

COUNTER_MOTIVATIONS = [
    "those endorphins won't release themselves",
    "your future self is sending eye rolls from tomorrow",
    "your workout playlist is feeling neglected",
    "that post-workout glow doesn't come from Netflix",
    "your muscles are plotting their revenge",
    "the gym misses your awkward selfies",
]

class RequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_POST(self):
        if self.path == '/generate-excuse':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                workout_type = data.get('workout_type')
                duration = data.get('duration')
                intensity = data.get('intensity')

                # Validate input
                if not workout_type or workout_type not in EXCUSES:
                    self._set_headers(400)
                    self.wfile.write(json.dumps({'error': 'Invalid workout type'}).encode())
                    return

                if not duration or not isinstance(duration, (int, float)) or duration < 1 or duration > 180:
                    self._set_headers(400)
                    self.wfile.write(json.dumps({'error': 'Duration must be between 1 and 180 minutes'}).encode())
                    return

                if not intensity or intensity not in ['light', 'moderate', 'intense']:
                    self._set_headers(400)
                    self.wfile.write(json.dumps({'error': 'Invalid intensity level'}).encode())
                    return

                excuse = random.choice(EXCUSES[workout_type])
                counter_motivation = random.choice(COUNTER_MOTIVATIONS)

                response = {
                    'excuse': f"I can't do {workout_type} today because {excuse}",
                    'counter_motivation': f"But remember: {counter_motivation}",
                    'workout_details': {
                        'workout_type': workout_type,
                        'duration_minutes': duration,
                        'intensity': intensity
                    }
                }

                self._set_headers()
                self.wfile.write(json.dumps(response).encode())

            except json.JSONDecodeError:
                self._set_headers(400)
                self.wfile.write(json.dumps({'error': 'Invalid JSON'}).encode())
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({'error': 'Internal server error'}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())

def run(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f'Server running on port {port}')
    httpd.serve_forever()

if __name__ == '__main__':
    run()