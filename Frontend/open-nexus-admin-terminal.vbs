Set shell = CreateObject("Shell.Application")
repoPath = "C:\Users\Win10\OneDrive\Documentos\NEXUS CORE\Nexus Core"
shell.ShellExecute "cmd.exe", "/k cd /d """ & repoPath & """ && title Nexus Core", "", "runas", 1
