# QR Code Scanning Feature Implementation

## Overview
This document explains the implementation of the QR code scanning feature in the Consumer Tracking page. The feature allows consumers to scan QR codes on herbal product packaging to verify authenticity and trace the supply chain journey.

## Implementation Details

### Libraries Used
1. **jsQR** - A pure JavaScript QR code scanning library that works directly in the browser
2. **Browser MediaDevices API** - For accessing the device camera

### Key Components

#### 1. State Management
- `isScanning`: Boolean state to track if the scanner is active
- `scanResult`: Stores the decoded QR code data
- `videoRef`: Reference to the video element for camera feed
- `canvasRef`: Reference to the canvas element for image processing
- `streamRef`: Reference to the media stream for cleanup

#### 2. Core Functions

##### `startScanning()`
- Requests camera access using `navigator.mediaDevices.getUserMedia()`
- Initializes the video stream with rear camera preference (`facingMode: 'environment'`)
- Starts the scanning loop

##### `scanFrame()`
- Captures video frames and converts them to image data
- Uses jsQR to detect and decode QR codes in the image
- Processes the result when a QR code is found

##### `stopScanning()`
- Stops the camera stream and releases resources
- Cleans up media tracks to prevent memory leaks

### User Interface

#### Scan Button
Located in the tracking page header, the "Scan QR Code" button triggers the scanning functionality.

#### Scanner Modal
When activated, a modal dialog appears with:
- Live camera feed display
- QR code scanning overlay
- Cancel button to stop scanning

### How It Works

1. User clicks "Scan QR Code" button
2. Browser requests camera permissions
3. Camera feed is displayed in a modal dialog
4. Video frames are continuously captured and analyzed
5. When a QR code is detected, it's decoded and the result is processed
6. Scanner automatically stops after successful detection
7. User can manually cancel scanning at any time

### Security Considerations

1. **Camera Permissions**: The feature only works after explicit user permission
2. **Local Processing**: QR code scanning happens entirely in the browser, no data is sent to external servers
3. **Resource Cleanup**: Media streams are properly closed to prevent privacy issues

### Error Handling

1. **Permission Denied**: Shows an alert if camera access is denied
2. **No Camera Available**: Handles devices without cameras gracefully
3. **Scanning Errors**: Catches and logs any scanning-related errors

## Testing the Feature

1. Navigate to `/consumer/tracking` page
2. Click the "Scan QR Code" button
3. Grant camera permissions when prompted
4. Point camera at a QR code
5. Observe the scan result alert

## Future Enhancements

1. **Custom QR Code Design**: Implement branded QR codes with logos
2. **Batch Lookup Integration**: Automatically fetch batch details after scanning
3. **Offline Support**: Cache recent scans for offline viewing
4. **History Tracking**: Maintain a history of scanned products