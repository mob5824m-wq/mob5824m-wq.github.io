#!/usr/bin/env python3
"""Local preview server that disables caching.

Plain `python3 -m http.server` sends Last-Modified and answers repeat
requests with 304 Not Modified, so a browser keeps showing stale CSS/JS
while you're editing. This sends no-store on everything instead.

Only for local previewing — GitHub Pages serves the static files itself.
"""
import functools
import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        # SimpleHTTPRequestHandler answers 304 by comparing If-Modified-Since
        # against the file mtime before any of our headers apply. Strip the
        # header off the request so it always sends the full body.
        if "If-Modified-Since" in self.headers:
            del self.headers["If-Modified-Since"]
        if "If-None-Match" in self.headers:
            del self.headers["If-None-Match"]
        return super().send_head()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_header(self, keyword, value):
        # Drop Last-Modified so the browser can't issue a 304 revalidation.
        if keyword.lower() == "last-modified":
            return
        super().send_header(keyword, value)


class Server(socketserver.TCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    handler = functools.partial(NoCacheHandler, directory=".")
    with Server(("0.0.0.0", PORT), handler) as httpd:
        print(f"Serving http://0.0.0.0:{PORT} with caching disabled")
        httpd.serve_forever()
