#!/usr/bin/env python3
"""Send real Chromium page-zoom shortcuts to the focused X11 window.

Only for CI under xvfb-run. Unlike CSS zoom, these affect browser page zoom.
No third-party Python packages are required.
"""
import ctypes
import sys
import time

x11 = ctypes.CDLL('libX11.so.6')
xtst = ctypes.CDLL('libXtst.so.6')
x11.XOpenDisplay.argtypes = [ctypes.c_char_p]
x11.XOpenDisplay.restype = ctypes.c_void_p
x11.XKeysymToKeycode.argtypes = [ctypes.c_void_p, ctypes.c_ulong]
x11.XKeysymToKeycode.restype = ctypes.c_uint
x11.XFlush.argtypes = [ctypes.c_void_p]
xtst.XTestFakeKeyEvent.argtypes = [ctypes.c_void_p, ctypes.c_uint, ctypes.c_int, ctypes.c_ulong]
display = x11.XOpenDisplay(None)
if not display:
    sys.exit('No X11 display; run this script under xvfb-run')
ctrl = x11.XKeysymToKeycode(display, 0xffe3)  # Control_L
plus = x11.XKeysymToKeycode(display, 0x002b)  # plus
if not ctrl or not plus:
    sys.exit('Unable to map Chromium zoom shortcut keys')
for _ in range(5):  # 100 -> 110 -> 125 -> 150 -> 175 -> 200 percent
    for key, down in ((ctrl, 1), (plus, 1), (plus, 0), (ctrl, 0)):
        xtst.XTestFakeKeyEvent(display, key, down, 0)
    x11.XFlush(display)
    time.sleep(0.35)
