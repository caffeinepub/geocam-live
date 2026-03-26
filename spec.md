# GeoCam Live

## Current State
New project -- no existing application files.

## Requested Changes (Diff)

### Add
- Live camera view with GPS coordinate overlay (latitude, longitude) displayed on screen in real time
- Photo capture that stamps GPS coordinates, date/time, and reverse-geocoded address onto the photo
- In-app photo gallery to view all captured photos
- Download button per photo for saving locally
- Backend storage for saved photos with metadata (lat, long, address, timestamp)

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Select components: camera, blob-storage, authorization
2. Generate Motoko backend with:
   - Photo record storage (blob reference, lat, long, address, timestamp)
   - CRUD: save photo metadata, list photos, delete photo
3. Frontend:
   - Camera tab: live camera feed with GPS overlay (lat/long), capture button
   - On capture: stamp GPS + date/time + address onto canvas, save to blob-storage and backend
   - Gallery tab: grid view of saved photos with metadata, download and delete per photo
   - Reverse geocoding via browser Geolocation API + free nominatim API (HTTP fetch from frontend)
