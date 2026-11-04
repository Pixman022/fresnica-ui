# Send a real OS Ctrl+NumpadPlus sequence to the foreground Edge window.
# This cannot be replaced with Playwright keyboard events or CSS zoom.
$ErrorActionPreference = "Stop"
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class V3NativeInput {
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hwnd);
  [DllImport("user32.dll")] public static extern void keybd_event(byte vk, byte scan, uint flags, UIntPtr extra);
}
'@
$windows = @(Get-Process -Name "msedge" -ErrorAction Stop |
  Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero } |
  Sort-Object StartTime -Descending)
if ($windows.Count -eq 0) {
  throw "No visible Microsoft Edge window. Headed browser may not be supported on this runner."
}
$edge = $windows | Where-Object { $_.MainWindowTitle -like "*Fresnica*" } | Select-Object -First 1
if (-not $edge) { $edge = $windows[0] }
$hwnd = $edge.MainWindowHandle
[void][V3NativeInput]::SetForegroundWindow($hwnd)
Start-Sleep -Milliseconds 350
$foreground = [V3NativeInput]::GetForegroundWindow()
Write-Host ("Native input: Edge pid=" + $edge.Id + " window=" + $hwnd + " title=" + $edge.MainWindowTitle + " foreground=" + $foreground)
if ($foreground -ne $hwnd) {
  throw "Cannot focus Edge's real desktop window; no native zoom validation was performed."
}
for ($n=0; $n -lt 5; $n++) {
  [V3NativeInput]::keybd_event(0x11,0,0,[UIntPtr]::Zero)
  [V3NativeInput]::keybd_event(0x6B,0,0,[UIntPtr]::Zero)
  [V3NativeInput]::keybd_event(0x6B,0,2,[UIntPtr]::Zero)
  [V3NativeInput]::keybd_event(0x11,0,2,[UIntPtr]::Zero)
  Start-Sleep -Milliseconds 170
}
Write-Host "Dispatched 5 native Ctrl+NumpadPlus shortcuts to Edge."
