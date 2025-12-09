# Slide Addition Workflow Documentation

## Overview
The Shaliah application implements a comprehensive workflow for adding and managing slides in a presentation system. This document outlines the complete process from file selection to storage and state management.

## Architecture Components

### 1. Data Types & Models

#### Core Types
- **`FileRecord`** (`src/types/Records.ts`): Base interface for IndexedDB records containing file data
  ```typescript
  interface FileRecord {
    id: string;
    file: File;
  }
  ```

- **`SlideModel`** (`src/types/SlideModel.ts`): Complete slide representation
  ```typescript
  interface SlideModel {
    id: string;
    name: string;
    file: NoSerialize<FileRecord>;
    type: "image" | "video";
    meta: SlideMetadata;
  }
  ```

- **`SlideMetadata`** (`src/types/SlideModel.ts`): Metadata for slides including blur hash and URLs
  ```typescript
  interface SlideMetadata {
    blurHash: string;
    url: string;
  }
  ```

### 2. File Selection Layer

#### MediaFilePicker Component (`src/components/controllers/MediaFilePicker/MediaFilePicker.tsx`)
- **Purpose**: Generic file picker wrapper that handles file input operations
- **Key Features**:
  - Hidden file input with custom trigger
  - Converts HTML File objects to FileRecord format
  - Generates unique IDs using timestamp
  - Resets input after file selection
- **Input**: HTML File objects from file picker
- **Output**: Array of `FileRecord` objects

#### SlidePicker Component (`src/components/controllers/MediaFilePicker/SlidePicker.tsx`)
- **Purpose**: Specialized wrapper for slide-specific file selection
- **Key Features**:
  - Accepts multiple files (images and videos)
  - File type filtering: `image/png,image/jpg,image/jpeg,video/mp4,video/webm,video/ogg`
  - Converts FileRecord to SlideModel
  - Processes metadata for each slide
- **Input**: FileRecord array from MediaFilePicker
- **Output**: Array of complete `SlideModel` objects

## 3. File Processing Pipeline

### Image/Video Processing
When files are selected, each file goes through the following processing:

1. **Type Detection**: Determines if file is image or video based on MIME type
2. **URL Creation**: Creates object URL for the file
3. **Metadata Processing**: Calls `processMetadata()` function

### Video Processing (`src/utils/processVideoFile.client.ts`)
For video files, additional processing occurs:
- **Video Element Creation**: Creates temporary hidden video element
- **Audio Detection**: Uses `checkVideoHasAudio()` to detect audio tracks
- **Poster Generation**: Extracts first frame as JPEG poster image
- **Dimensions**: Respects max dimensions (320x180) while preserving aspect ratio

### Image Processing (`src/utils/blurhash.client.ts`)
For all visual content (images and video posters):
- **BlurHash Generation**: Creates blur hash for progressive loading
- **Canvas Processing**: Uses canvas to downsample image for hash generation
- **Aspect Ratio Preservation**: Maintains original aspect ratios

## 4. State Management

### Slides Context (`src/contexts/SlidesContext.tsx`)
- **Purpose**: Global state container for all slides in the presentation
- **Implementation**: Uses Qwik's `useStore()` for reactive state
- **Synchronization**: Integrates with `useSharedState()` for cross-tab sync
- **Structure**: Simple array of `SlideModel` objects

### Presentation Context (`src/contexts/PresentationContext.tsx`)
- **Purpose**: Manages presentation-level state and metadata
- **Key Features**:
  - Auto-generates presentation IDs
  - Tracks stored presentations
  - Session synchronization
- **ID Generation**: Uses timestamp-based ID generation

### Shared State System (`src/hooks/useSharedState.tsx`)
- **Purpose**: Synchronizes state across browser tabs and with server
- **Process**:
  1. Tracks state changes using Qwik's reactivity
  2. Generates diffs between previous and current state
  3. Queues updates for server synchronization
  4. Initializes state from server session data

## 5. Storage Layer

### IndexedDB Service (`src/services/IndexedDatabaseService/`)
- **Purpose**: Client-side persistent storage for file data
- **Components**:
  - **IndexedDatabaseService**: Main service class for CRUD operations
  - **IndexedDatabaseVersionManager**: Handles database versioning
  - **IndexedDatabaseServiceFactory**: Creates service instances

### Storage Process:
1. **Database Creation**: One database per presentation (using presentation ID)
2. **Object Store**: Uses presentation ID as both database name and store name
3. **Key Path**: Uses `id` field as primary key
4. **Version Management**: Tracked in localStorage for upgrade handling

## 6. User Interface Integration

### Main Page (`src/routes/index.tsx`)
The main interface shows two states:

#### Empty State
- Large "Add slides" button
- Directly wraps SlidePicker component
- Action: `slides.push(...selected)` - adds slides to context

#### Populated State
- List of slide thumbnails using Slide component
- Each slide shows preview and delete button
- Additional "+" button for adding more slides
- Action: Same push operation to slides context

### Slide Component (`src/components/ui/Slide/Slide.tsx`)
- **Purpose**: Individual slide display and controls
- **Features**:
  - Thumbnail preview with blur hash placeholder
  - Slide name display
  - Delete functionality
  - Video indicator overlay for video slides

## 7. Complete Workflow

### Step-by-Step Process:

1. **User Interaction**: User clicks "Add slides" or "+" button
2. **File Selection**: Browser file picker opens (filtered by supported types)
3. **File Processing**: 
   - Files converted to FileRecord format
   - Each file processed through SlidePicker
   - Metadata extracted (blur hash, video processing)
4. **Slide Creation**: Complete SlideModel objects created
5. **State Update**: Slides added to SlidesContext via `slides.push(...selected)`
6. **Reactivity Chain**:
   - SlidesContext update triggers UI re-render
   - useSharedState detects change and creates diff
   - Diff queued for server synchronization
7. **Storage**: Files can be persisted to IndexedDB (feature appears partially implemented)
8. **Presentation**: Slides displayed in main interface

## 8. Data Flow Diagram

```
User File Selection
        ↓
MediaFilePicker (HTML Files → FileRecord[])
        ↓
SlidePicker (FileRecord[] → SlideModel[])
        ↓
File Processing Pipeline
├── Video Processing (poster, audio detection)
├── BlurHash Generation  
└── Metadata Creation
        ↓
SlidesContext.push(...slides)
        ↓
State Synchronization
├── useSharedState (cross-tab sync)
├── SharedStateQueue (server sync)
└── Session Storage
        ↓
UI Update (Slide components rendered)
```

## 9. Key Features

- **File Type Support**: Images (PNG, JPG, JPEG) and Videos (MP4, WebM, OGG)
- **Progressive Loading**: BlurHash implementation for smooth loading experience
- **Cross-Tab Synchronization**: State shared across browser tabs
- **Server Synchronization**: Changes pushed to server session
- **Video Processing**: Automatic poster generation and audio detection
- **Persistent Storage**: IndexedDB for client-side file storage
- **Reactive UI**: Real-time updates using Qwik's reactivity system

## 10. Current Implementation Status

### Fully Implemented:
- File selection and processing
- Slide model creation
- State management and synchronization
- UI components and interactions
- Video processing capabilities
- BlurHash generation

### Partially Implemented:
- IndexedDB persistence (service exists but integration unclear)
- Presentation restoration from stored data
- Server-side session management

### Future Considerations:
- File compression for large images/videos
- Slide reordering capabilities
- Bulk operations (select multiple slides)
- Preview functionality improvements
