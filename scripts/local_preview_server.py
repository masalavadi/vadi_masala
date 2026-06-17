from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def main():
    os.chdir(Path(__file__).resolve().parents[1])
    server = ThreadingHTTPServer(("127.0.0.1", 8040), QuietHandler)
    server.serve_forever()


if __name__ == "__main__":
    main()
