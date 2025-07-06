# 🚀 Pathfinding Visualizer

## ✨ Features

### **Interactive Grid**
- **Dynamic Grid Generation**: Automatically adjusts to your screen size
- **Real-time Wall Building**: Click and drag to create obstacles
- **Start/End Point Placement**: Drag to reposition start (green) and end (red) points
- **Responsive Design**: Works seamlessly on different screen sizes

### **Multiple Algorithms**
- **Breadth-First Search (BFS)**: Explores level by level, guaranteed shortest path
- **Depth-First Search (DFS)**: Goes deep first, explores all possible paths
- **Multi-Source BFS**: Bidirectional search from both start and end points

### **Beautiful Animations**
- **Smooth Node Transitions**: Each visited node animates with particle effects
- **Path Visualization**: Animated path reconstruction with glowing effects
- **Interactive Controls**: Hover and click animations on all UI elements
- **Particle Background**: Floating particles create an immersive experience

### **Performance Controls**
- **4 Speed Levels**: 0.5x, 1x, 2x, and 4x visualization speeds
- **Play/Pause**: Control algorithm execution in real-time
- **Reset Functionality**: Clear the grid and start fresh
- **Real-time Stats**: Live algorithm statistics and node count

### **Modern UI/UX**
- **Dark/Light Mode**: Toggle between themes with animated transitions
- **Glassmorphism Design**: Modern frosted glass effect on controls
- **Responsive Layout**: Optimized for desktop and mobile viewing
- **Loading Screen**: Beautiful animated startup sequence

## How to Use

### Basic Controls
- **Click and Drag**: Create walls by clicking and dragging on empty cells
- **Drag Start/End**: Click and drag the green (start) or red (end) nodes to reposition them
- **Algorithm Selection**: Choose from BFS, DFS, or Multi-Source BFS from the dropdown
- **Speed Control**: Click the speed button to cycle through 0.5x, 1x, 2x, and 4x speeds
- **Play/Pause**: Use the play button to start or pause the algorithm
- **Reset**: Click the refresh button to clear the grid and reset everything

### Understanding the Visualization
- **Green Node**: Starting point
- **Red Node**: Destination point
- **Blue Nodes**: Visited cells during algorithm execution
- **Yellow Path**: Final path from start to end
- **Gray Walls**: Obstacles that algorithms must navigate around

## 🎯 Algorithm Details

### Breadth-First Search (BFS)
- **Time Complexity**: O(V + E) where V is vertices and E is edges
- **Space Complexity**: O(V)
- **Guarantee**: Always finds the shortest path
- **Best For**: Finding shortest paths in unweighted graphs

### Depth-First Search (DFS)
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V) in worst case
- **Guarantee**: Finds a path (not necessarily shortest)
- **Best For**: Exploring all possible paths, maze solving

### Multi-Source BFS
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V)
- **Guarantee**: Finds shortest path with bidirectional search
- **Best For**: Faster pathfinding in large grids
