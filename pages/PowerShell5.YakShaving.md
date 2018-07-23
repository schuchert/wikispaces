---
title: PowerShell5.YakShaving
---
[[PowerShell5|<--Back]]
# Overview
All of these tutorials are written using Windows 10 Professional, PowerShell 5.1, [Pester](https://github.com/pester/Pester), and [Visual Studio Code](https://code.visualstudio.com/download). Here are the specifics.
* Windows 10 Professional, Version 1703
* PowerShell 5.1.15063.608
* Pester 4.0.8
* Visual Studio Code 1.16.1

While detailed setup instructions might come later, here are a few notes.

## PowerShell
* Install Pester (need to run as Admin)
* Install [Solarized](https://github.com/neilpa/cmd-colors-solarized) color scheme

## Pester
* Seems the default install-module needs admin access. As of this writing, I'm a novice. I'll eventually not install these in "C:\Program Files\WindowsPowerShell\Modules"

## Visual Studio Code
Modules I've installed:
* Powershell 1.4.3
* Vim 0.10.1
Set up custom tasks to run pester. One will run all tests, while the other will run only the current Pester .tests.ps1 file. To update, 
* Select the **Tasks** Menu, 
* Then **Configure Tasks**
* If this is the first time you've configured tasks, select **Other** as the template to use. 
* Finally, paste the following JSON into the custom tasks window
```javascript
    {
        // See https://go.microsoft.com/fwlink/?LinkId=733558
        // for the documentation about the tasks.json format
        "version": "2.0.0",
        "_runner": "terminal",
        "windows" : {
            "command":"powershell.exe"
        },
        "presentation": {
            "reveal": "always",
            "panel": "new"
        },
        "tasks": [
            {
                "taskName": "Run.AllTests",
                "type": "shell",
                "command": "Invoke-Pester",
                "problemMatcher": [
                    "$pester"
                ],
                "presentation": {
                    "echo": true,
                    "reveal": "always",
                    "focus": false,
                    "panel": "dedicated"
                }
            },
            {
                "taskName": "Run.CurrentFile",
                "type": "shell",
                "command": "Invoke-Pester",
                "args": [
                    "${file}"
                ],
                "problemMatcher": [
                    "$pester"
                ],
                "presentation": {
                    "echo": true,
                    "reveal": "always",
                    "focus": false,
                    "panel": "dedicated"
                }
            }
        ]
    }
```
Custom key bindings to run the custom tasks:
* Select **File::Preferences::Keyboard Shortcuts**
* Next, click on the link at the top of the window for **keybindings.json**
* The left window contains the default values. Edit the right window to override the default values. Copy the following key bindings:
```javascript
    [{
        "key": "ctrl+shift+alt+t",
        "command": "workbench.action.tasks.runTask",
        "args": "Run.AllTests",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+alt+f",
        "command": "workbench.action.tasks.runTask",
        "args": "Run.CurrentFile",
        "when": "editorTextFocus"
    }
    ]
```

[[PowerShell5|<--Back]]
