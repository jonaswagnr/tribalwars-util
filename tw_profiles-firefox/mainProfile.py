import subprocess
import os

# Path to Firefox executable
firefox_path = "/Applications/Firefox.app/Contents/MacOS/firefox"

# Profile name
profile_name = "784e7zcz.default-release"

# Command to start Firefox with the specified profile
command = [firefox_path, "-P", profile_name]

# Execute the command
subprocess.run(command)
