import os
import shutil
import subprocess
import time

def get_firefox_profiles_directory():
    return os.path.expanduser("~/Library/Application Support/Firefox/Profiles")

def find_profile_directory(base_profile_name):
    profiles_dir = get_firefox_profiles_directory()
    for profile in os.listdir(profiles_dir):
        if profile.endswith(base_profile_name):
            return profile
    return None

def copy_profile_data(src_profile, dest_profile):
    profiles_dir = get_firefox_profiles_directory()
    src_dir = os.path.join(profiles_dir, src_profile)
    dest_dir = os.path.join(profiles_dir, dest_profile)
    
    if not os.path.exists(src_dir):
        print(f"Source profile directory {src_dir} does not exist.")
        return

    if not os.path.exists(dest_dir):
        print(f"Destination profile directory {dest_dir} does not exist.")
        return
    
    # Copy the entire contents of the source profile to the destination profile
    for item in os.listdir(src_dir):
        src_item = os.path.join(src_dir, item)
        dest_item = os.path.join(dest_dir, item)
        if os.path.isdir(src_item):
            shutil.copytree(src_item, dest_item, dirs_exist_ok=True)
        else:
            shutil.copy2(src_item, dest_item)

def open_firefox_profile(profile_name):
    firefox_path = '/Applications/Firefox.app/Contents/MacOS/firefox'
    command = [firefox_path, '-P', profile_name, '--private-window']
    subprocess.Popen(command)

if __name__ == "__main__":
    base_profile_name = "Profile"
    source_profile_suffix = "Profile3"
    source_profile = find_profile_directory(source_profile_suffix)
    
    if source_profile is None:
        print(f"Source profile {source_profile_suffix} not found.")
        exit(1)
    
    # Copy Profile3 data to other profiles
    for i in range(1, 9):
        if i != 3:  # Skip Profile3 itself
            dest_profile_suffix = f"{base_profile_name}{i}"
            dest_profile = find_profile_directory(dest_profile_suffix)
            if dest_profile:
                print(f"Copying data from {source_profile} to {dest_profile}")
                copy_profile_data(source_profile, dest_profile)
                time.sleep(1)  # Wait a bit to ensure copying process

    # Open all profiles in private windows
    for i in range(1, 9):
        profile_suffix = f"{base_profile_name}{i}"
        profile_name = find_profile_directory(profile_suffix)
        if profile_name:
            print(f"Opening Firefox profile: {profile_name} in a private window")
            open_firefox_profile(profile_name)
            time.sleep(2)  # Wait a bit between opening windows to avoid overwhelming the system

    print("All profiles updated and opened in private windows successfully!")
