kill $(cat chrome-headless.pid)
google-chrome --headless --hide-scrollbars --remote-debugging-port=9222 --disable-gpu & echo $!>chrome-headless.pid