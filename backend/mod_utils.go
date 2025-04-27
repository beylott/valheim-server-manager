package main

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

func ListMods(modDir string) ([]string, error) {
	entries, err := os.ReadDir(modDir)
	if err != nil {
		return nil, err
	}

	mods := []string{}
	for _, entry := range entries {
		if !entry.IsDir() {
			mods = append(mods, entry.Name())
		}
	}
	return mods, nil
}

func SaveMod(modDir, filename string, data io.Reader) error {
	outPath := filepath.Join(modDir, filename)
	outFile, err := os.Create(outPath)
	if err != nil {
		return err
	}
	defer outFile.Close()

	_, err = io.Copy(outFile, data)
	return err
}

func DeleteMod(modDir, filename string) error {
	target := filepath.Join(modDir, filename)
	return os.Remove(target)
}

func TriggerRestart() error {
	// Create a "restart.flag" file Valheim entrypoint watches for
	return ioutil.WriteFile("/tmp/restart.flag", []byte("restart"), 0644)
}

func WriteJSON(w io.Writer, v any) {
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	enc.Encode(v)
}

func LoadUsers(configDir string) ([]string, []string, error) {
	permittedPath := filepath.Join(configDir, "permittedlist.txt")
	adminPath := filepath.Join(configDir, "adminlist.txt")

	permitted, err := readLines(permittedPath)
	if err != nil {
		return nil, nil, err
	}
	admins, err := readLines(adminPath)
	if err != nil {
		return nil, nil, err
	}
	return permitted, admins, nil
}

func AddUser(configDir, steamID string, isAdmin bool) error {
	if isAdmin {
		return appendLine(filepath.Join(configDir, "adminlist.txt"), steamID)
	}
	return appendLine(filepath.Join(configDir, "permittedlist.txt"), steamID)
}

func RemoveUser(configDir, steamID string) error {
	// Remove from both admin and permitted lists
	_ = removeLine(filepath.Join(configDir, "adminlist.txt"), steamID)
	return removeLine(filepath.Join(configDir, "permittedlist.txt"), steamID)
}

func readLines(path string) ([]string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	lines := strings.Split(strings.TrimSpace(string(data)), "\n")
	return lines, nil
}

func appendLine(path, line string) error {
	f, err := os.OpenFile(path, os.O_APPEND|os.O_WRONLY|os.O_CREATE, 0644)
	if err != nil {
		return err
	}
	defer f.Close()

	_, err = f.WriteString(line + "\n")
	return err
}

func removeLine(path, target string) error {
	lines, err := readLines(path)
	if err != nil {
		return err
	}
	newLines := []string{}
	for _, line := range lines {
		if line != target {
			newLines = append(newLines, line)
		}
	}
	return os.WriteFile(path, []byte(strings.Join(newLines, "\n")+"\n"), 0644)
}

func SaveUsers(configDir string, permitted []string, admins []string) error {
	permittedPath := filepath.Join(configDir, "permittedlist.txt")
	adminPath := filepath.Join(configDir, "adminlist.txt")

	if err := os.WriteFile(permittedPath, []byte(strings.Join(permitted, "\n")+"\n"), 0644); err != nil {
		return err
	}
	if err := os.WriteFile(adminPath, []byte(strings.Join(admins, "\n")+"\n"), 0644); err != nil {
		return err
	}
	return nil
}
