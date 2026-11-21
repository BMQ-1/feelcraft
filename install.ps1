$ErrorActionPreference = "Stop"

$RepoZip = "https://github.com/BMQ-1/feelcraft/archive/refs/heads/main.zip"
$TmpDir = Join-Path ([System.IO.Path]::GetTempPath()) ("feelcraft-" + [System.Guid]::NewGuid().ToString("N"))

try {
    New-Item -ItemType Directory -Path $TmpDir -Force | Out-Null
    $ZipPath = Join-Path $TmpDir "feelcraft.zip"
    Write-Host "Downloading Feelcraft..."
    Invoke-WebRequest -Uri $RepoZip -OutFile $ZipPath
    Expand-Archive -Path $ZipPath -DestinationPath $TmpDir -Force

    $SrcDir = Join-Path $TmpDir "feelcraft-main\feelcraft"
    if (-not (Test-Path $SrcDir)) {
        throw "Could not locate feelcraft directory inside archive."
    }

    $Targets = @(
        @{ Check = "$HOME\.gemini"; Dest = "$HOME\.gemini\config\skills\feelcraft"; Name = "Antigravity" },
        @{ Check = "$HOME\.codex";  Dest = "$HOME\.codex\skills\feelcraft";         Name = "OpenAI Codex" },
        @{ Check = "$HOME\.claude"; Dest = "$HOME\.claude\skills\feelcraft";        Name = "Claude Code" },
        @{ Check = $HOME;           Dest = "$HOME\.agents\skills\feelcraft";        Name = "Universal (.agents)" }
    )

    $Count = 0
    foreach ($T in $Targets) {
        if (Test-Path $T.Check) {
            $Parent = Split-Path $T.Dest -Parent
            New-Item -ItemType Directory -Path $Parent -Force | Out-Null
            if (Test-Path $T.Dest) { Remove-Item -Path $T.Dest -Recurse -Force }
            Copy-Item -Path $SrcDir -Destination $T.Dest -Recurse -Force
            Write-Host "  + Installed for $($T.Name) -> $($T.Dest)"
            $Count++
        }
    }

    Write-Host ""
    Write-Host "Done! Feelcraft installed in $Count location(s)."
    Write-Host "Try it in your agent: /feelcraft  or  `$feelcraft  or  'Use feelcraft on this project'"
}
finally {
    if (Test-Path $TmpDir) { Remove-Item -Path $TmpDir -Recurse -Force -ErrorAction SilentlyContinue }
}
