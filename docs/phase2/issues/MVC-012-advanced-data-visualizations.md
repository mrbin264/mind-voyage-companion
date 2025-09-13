# [MVC-012] Advanced data visualizations

**Phase**: 2 (Pro Features)  
**Priority**: Medium  
**GitHub Issue**: [#12](https://github.com/mrbin264/mind-voyage-companion/issues/12)

## User Story

**ID**: MVC-012  
**Description**: As a Pro user, I want interactive visualizations of my habit and mood data so that I can better understand my patterns and stay motivated through creative progress representations

## Acceptance Criteria

- [ ] Habit Garden visualization maps streak lengths to plant growth metaphors
- [ ] Mood Galaxy presents emotional patterns through constellation-like interface
- [ ] Visualizations load within 2 seconds and respond to interactions within 100ms
- [ ] Interactive elements allow drilling down into specific time periods and data points
- [ ] Visualizations are accessible and provide alternative text descriptions

## Priority

Medium - Phase 2 (Pro Feature)

## Technical Notes

- Custom visualization components for Habit Garden and Mood Galaxy
- Performance optimization for smooth interactions
- Accessibility compliance with ARIA labels and alt text
- Interactive drilling down into data details
- WebGL or Canvas for complex visualizations

## Definition of Done

- [ ] Habit Garden visualization implemented with plant metaphors
- [ ] Mood Galaxy constellation interface created
- [ ] Performance targets met (2s load, 100ms interaction)
- [ ] Interactive drilling down functionality
- [ ] Accessibility features implemented
- [ ] Mobile-responsive design

## Dependencies

- MVC-003 (Habit completion) - Required for habit streak data
- MVC-004 (Journaling) - Required for mood data
- MVC-011 (Subscription) - Required for Pro feature access

## Estimated Effort

**Story Points**: 21  
**Time Estimate**: 3-4 weeks

## Technical Implementation Details

### Frontend Components
- HabitGarden with SVG/Canvas plant visualizations
- MoodGalaxy with interactive constellation map
- VisualizationContainer with loading states
- DataDrillDown for detailed view
- AccessibilityControls for alternative representations

### Backend API Endpoints
- `GET /api/visualizations/habit-garden` - Get habit garden data
- `GET /api/visualizations/mood-galaxy` - Get mood galaxy data
- `GET /api/visualizations/data/:type/:period` - Get drill-down data

### Habit Garden Visualization
```typescript
interface HabitPlant {
  habitId: string;
  habitTitle: string;
  plantType: 'seedling' | 'sprout' | 'young' | 'mature' | 'flourishing';
  growthStage: number; // 0-100
  streak: number;
  lastWatered: Date; // Last completion
  color: string;
  position: { x: number; y: number };
}

class HabitGarden {
  private plants: HabitPlant[] = [];
  
  updatePlant(habitId: string, streak: number, lastCompletion: Date) {
    const plant = this.plants.find(p => p.habitId === habitId);
    if (plant) {
      plant.streak = streak;
      plant.growthStage = this.calculateGrowthStage(streak);
      plant.plantType = this.getPlantType(plant.growthStage);
      plant.lastWatered = lastCompletion;
    }
  }
  
  private calculateGrowthStage(streak: number): number {
    // Algorithm to convert streak to growth percentage
    // 0-7 days: seedling (0-20%)
    // 8-21 days: sprout (21-40%)
    // 22-60 days: young (41-70%)
    // 61-120 days: mature (71-90%)
    // 120+ days: flourishing (91-100%)
  }
}
```

### Mood Galaxy Visualization
```typescript
interface MoodStar {
  date: Date;
  mood: number; // 1-5
  brightness: number; // Based on mood level
  size: number; // Based on journal entry length
  constellation: string; // Mood pattern grouping
  position: { x: number; y: number; z: number };
}

interface MoodConstellation {
  name: string;
  moodRange: [number, number];
  color: string;
  stars: MoodStar[];
  pattern: 'cluster' | 'line' | 'circle' | 'scattered';
}

class MoodGalaxy {
  private stars: MoodStar[] = [];
  private constellations: MoodConstellation[] = [];
  
  generateGalaxy(moodData: { date: Date; mood: number; entryLength: number }[]) {
    this.stars = moodData.map(entry => ({
      date: entry.date,
      mood: entry.mood,
      brightness: entry.mood * 20, // 1-5 -> 20-100%
      size: Math.min(entry.entryLength / 100, 5), // Size based on writing
      constellation: this.getConstellation(entry.mood),
      position: this.calculatePosition(entry.date, entry.mood)
    }));
    
    this.groupIntoConstellations();
  }
}
```

### Performance Optimizations
- Virtual scrolling for large datasets
- WebGL rendering for smooth animations
- Data aggregation for time periods
- Lazy loading of visualization components
- Optimistic updates for real-time feel

### Accessibility Features
```typescript
interface AccessibilityOptions {
  highContrast: boolean;
  reduceMotion: boolean;
  screenReaderMode: boolean;
  alternativeViews: 'table' | 'list' | 'text';
}

class AccessibleVisualization {
  generateAltText(visualization: 'garden' | 'galaxy'): string {
    // Generate descriptive text for screen readers
    // "Your habit garden shows 3 flourishing plants..."
  }
  
  generateDataTable(data: any[]): TableData {
    // Convert visualization data to accessible table
  }
  
  announceChanges(change: string) {
    // Announce interactive changes to screen readers
  }
}
```

### Interactive Features
- Click/tap to drill down into specific habits/dates
- Time range slider to view different periods
- Filter by mood range or habit type
- Zoom and pan for detailed exploration
- Export visualization as image/PDF

### Mobile Responsiveness
- Touch-friendly interaction targets
- Simplified mobile layouts
- Gesture support (pinch to zoom, swipe)
- Responsive sizing based on screen dimensions
- Progressive enhancement for different devices

### Data Processing Pipeline
```typescript
interface VisualizationData {
  habits: {
    streak: number;
    completions: Date[];
    title: string;
  }[];
  moods: {
    date: Date;
    value: number;
    entryLength: number;
  }[];
  timeRange: {
    start: Date;
    end: Date;
  };
}

async function processVisualizationData(
  userId: string,
  timeRange: DateRange
): Promise<VisualizationData> {
  // Aggregate and optimize data for visualizations
  // Apply privacy filters
  // Calculate derived metrics
}
```

## Testing Strategy

- Performance tests for 2s load and 100ms interaction targets
- Visual regression tests for consistent rendering
- Accessibility testing with screen readers
- Cross-browser compatibility testing
- Mobile device testing across different screen sizes
- Load testing with large datasets
- User acceptance testing for intuitiveness