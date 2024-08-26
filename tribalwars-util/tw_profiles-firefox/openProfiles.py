import subprocess
import time
import getpass

def open_firefox_profile(profile_name):
    firefox_path = '/Applications/Firefox.app/Contents/MacOS/firefox'
    command = [firefox_path, '-P', profile_name, '--private-window']
    subprocess.Popen(command)

if __name__ == "__main__":
    base_profile_name = "Profile"
    for i in range(1, 9):
        profile_name = f"{base_profile_name}{i}"
        print(f"Opening Firefox profile: {profile_name} in a private window")
        open_firefox_profile(profile_name)
        time.sleep(2)  # Wait a bit between opening windows to avoid overwhelming the system

    print("All profiles opened in private windows successfully!")