import subprocess

def create_firefox_profile(profile_name):
    firefox_path = '/Applications/Firefox.app/Contents/MacOS/firefox'
    command = [firefox_path, '-CreateProfile', profile_name]
    subprocess.run(command, check=True)

if __name__ == "__main__":
    base_profile_name = "Profile"
    for i in range(1, 9):
        profile_name = f"{base_profile_name}{i}"
        print(f"Creating Firefox profile: {profile_name}")
        create_firefox_profile(profile_name)
    print("All profiles created successfully!")
