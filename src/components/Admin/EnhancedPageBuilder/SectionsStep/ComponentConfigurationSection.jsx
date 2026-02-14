import { useState } from "react";
import {
  DocumentTextIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import Button from "../../../UI/Button";
import Card, { CardContent, CardHeader, CardTitle } from "../../../UI/Card";
import { ComponentToggles } from "../../../UI/FancyToggle";
import ComponentFormRenderer from "./ComponentFormRenderer";

// Sortable Component Tab Item
const SortableComponentTab = ({
  id,
  index,
  comp,
  isActive,
  isCompleted,
  componentIcon,
  onClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
        min-w-fit whitespace-nowrap cursor-grab active:cursor-grabbing
        ${isDragging ? "shadow-lg scale-105" : ""}
        ${
          isActive
            ? "bg-blue-500/30 border-2 border-blue-400 text-white"
            : isCompleted
              ? "bg-green-500/20 border border-green-400/50 text-green-300"
              : "bg-white/5 border border-white/20 text-gray-400 hover:bg-white/10 hover:text-white"
        }
      `}
      {...attributes}
      {...listeners}
    >
      <Bars3Icon className="h-3 w-3 text-gray-500" />
      {isCompleted && !isActive ? (
        <CheckCircleIcon className="h-4 w-4 text-green-400" />
      ) : (
        <span className="text-sm">{componentIcon}</span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick(index);
        }}
        className="text-xs font-medium"
      >
        {comp.componentName || comp.componentType || `Component ${index + 1}`}
      </button>
    </div>
  );
};

const ComponentConfigurationSection = ({
  components,
  availableComponents,
  onUpdateComponent,
  onRemoveComponent,
  onReorderComponents,
  componentSchemas,
  getAboutComponentSchema,
  getGeneralComponentSchema,
  getSupportComponentSchema,
  generateDynamicSchema,
  validateAndFormatJSON,
}) => {
  // Current component step (0-indexed)
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);

  // Track completed components for progress indicator
  const [completedComponents, setCompletedComponents] = useState(new Set());

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handle drag end for reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = components.findIndex(
        (_, i) => `component-${i}` === active.id,
      );
      const newIndex = components.findIndex(
        (_, i) => `component-${i}` === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        // Create new order
        const newComponents = arrayMove(components, oldIndex, newIndex);

        // Update orderIndex for all components
        const updatedComponents = newComponents.map((comp, idx) => ({
          ...comp,
          orderIndex: idx + 1,
        }));

        // Call the reorder callback
        if (onReorderComponents) {
          onReorderComponents(updatedComponents);
        }

        // Adjust current index if needed
        if (currentComponentIndex === oldIndex) {
          setCurrentComponentIndex(newIndex);
        } else if (
          currentComponentIndex > oldIndex &&
          currentComponentIndex <= newIndex
        ) {
          setCurrentComponentIndex(currentComponentIndex - 1);
        } else if (
          currentComponentIndex < oldIndex &&
          currentComponentIndex >= newIndex
        ) {
          setCurrentComponentIndex(currentComponentIndex + 1);
        }
      }
    }
  };

  const handleComponentUpdate = (index, field, value) => {
    if (field === "orderIndex") {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onUpdateComponent(index, field, numValue);
      }
    } else {
      onUpdateComponent(index, field, value);
    }

    // Mark component as modified (for progress tracking)
    if (field === "contentJson") {
      setCompletedComponents((prev) => new Set([...prev, index]));
    }
  };

  const handleNext = () => {
    if (currentComponentIndex < components.length - 1) {
      // Mark current as completed before moving
      setCompletedComponents(
        (prev) => new Set([...prev, currentComponentIndex]),
      );
      setCurrentComponentIndex(currentComponentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentComponentIndex > 0) {
      setCurrentComponentIndex(currentComponentIndex - 1);
    }
  };

  const handleGoToComponent = (index) => {
    setCurrentComponentIndex(index);
  };

  const handleRemoveCurrentComponent = () => {
    onRemoveComponent(currentComponentIndex);
    // Adjust current index if needed
    if (
      currentComponentIndex >= components.length - 1 &&
      currentComponentIndex > 0
    ) {
      setCurrentComponentIndex(currentComponentIndex - 1);
    }
    // Remove from completed set
    setCompletedComponents((prev) => {
      const newSet = new Set(prev);
      newSet.delete(currentComponentIndex);
      return newSet;
    });
  };

  // Empty state
  if (components.length === 0) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-xl font-bold">
            Component Configuration (0)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[600px] flex flex-col">
          <div className="text-center py-12 flex-1 flex items-center justify-center">
            <div>
              <DocumentTextIcon className="h-20 w-20 text-white/40 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">
                No components added yet
              </h3>
              <p className="text-gray-300 text-base leading-relaxed">
                Click on components above or use "Add Component" button to start
                building your page
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get current component
  const component = components[currentComponentIndex];
  const isVisible = component?.isVisible === true || component?.isVisible === 1;
  const themeClass = component?.theme === 1 ? "light" : "dark";

  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-xl font-bold">
            Component Configuration
          </CardTitle>
          <div className="text-sm text-gray-400">
            Step {currentComponentIndex + 1} of {components.length}
          </div>
        </div>

        {/* Progress Steps Indicator with Drag & Drop */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Bars3Icon className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-400">
              Drag to reorder components
            </span>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={components.map((_, index) => `component-${index}`)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {components.map((comp, index) => {
                  const isActive = index === currentComponentIndex;
                  const isCompleted = completedComponents.has(index);
                  const componentIcon =
                    availableComponents.find(
                      (c) => c.componentType === comp.componentType,
                    )?.icon || "📦";

                  return (
                    <SortableComponentTab
                      key={`component-${index}`}
                      id={`component-${index}`}
                      index={index}
                      comp={comp}
                      isActive={isActive}
                      isCompleted={isCompleted}
                      componentIcon={componentIcon}
                      onClick={handleGoToComponent}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col">
        {/* Current Component Configuration */}
        <div
          className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border transition-all duration-500 ${
            !isVisible
              ? "border-red-400/40 bg-red-500/5 opacity-60"
              : component?.theme === 1
                ? "border-yellow-400/30 bg-yellow-500/5"
                : "border-gray-400/30 bg-gray-500/5"
          }`}
          data-theme={themeClass}
          data-component-visible={isVisible}
        >
          {/* Component Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {availableComponents.find(
                  (c) => c.componentType === component?.componentType,
                )?.icon || "📦"}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {component?.componentName ||
                    component?.componentType ||
                    `Component #${currentComponentIndex + 1}`}
                </h4>
                <p className="text-sm text-gray-400">
                  {component?.componentType}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRemoveCurrentComponent}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-red-500/20 hover:border-red-400 transition-all duration-200"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>

          {/* Component Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Component Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Component Type
                </label>
                <input
                  type="text"
                  value={component?.componentType || ""}
                  onChange={(e) =>
                    handleComponentUpdate(
                      currentComponentIndex,
                      "componentType",
                      e.target.value,
                    )
                  }
                  placeholder="e.g., HeroSection, CtaButton"
                  className="block w-full rounded-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-blue-400/20 shadow-sm"
                />
              </div>

              {/* Component Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Component Name
                </label>
                <input
                  type="text"
                  value={component?.componentName || ""}
                  onChange={(e) =>
                    handleComponentUpdate(
                      currentComponentIndex,
                      "componentName",
                      e.target.value,
                    )
                  }
                  placeholder="e.g., Main Hero, Footer CTA"
                  className="block w-full rounded-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-blue-400/20 shadow-sm"
                />
              </div>

              {/* Component Toggles */}
              <div className="md:col-span-2 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                <ComponentToggles
                  isVisible={isVisible}
                  theme={component?.theme || 1}
                  onVisibilityChange={(val) =>
                    handleComponentUpdate(
                      currentComponentIndex,
                      "isVisible",
                      val,
                    )
                  }
                  onThemeChange={(val) =>
                    handleComponentUpdate(currentComponentIndex, "theme", val)
                  }
                  size="normal"
                  layout="horizontal"
                />
              </div>
            </div>

            {/* Content Configuration */}
            <div className="col-span-full">
              <ComponentFormRenderer
                component={component}
                index={currentComponentIndex}
                componentSchemas={componentSchemas}
                getAboutComponentSchema={getAboutComponentSchema}
                getGeneralComponentSchema={getGeneralComponentSchema}
                getSupportComponentSchema={getSupportComponentSchema}
                generateDynamicSchema={generateDynamicSchema}
                validateAndFormatJSON={validateAndFormatJSON}
                onUpdate={handleComponentUpdate}
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <button
            onClick={handlePrevious}
            disabled={currentComponentIndex === 0}
            style={{
              backgroundColor:
                currentComponentIndex === 0 ? "#374151" : "#4B5563",
              color: currentComponentIndex === 0 ? "#9CA3AF" : "#FFFFFF",
              border: "2px solid",
              borderColor: currentComponentIndex === 0 ? "#4B5563" : "#6B7280",
              opacity: currentComponentIndex === 0 ? 0.6 : 1,
              cursor: currentComponentIndex === 0 ? "not-allowed" : "pointer",
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 font-semibold hover:opacity-90"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {components.map((_, index) => (
              <button
                key={index}
                onClick={() => handleGoToComponent(index)}
                className={`
                  w-2.5 h-2.5 rounded-full transition-all duration-200
                  ${
                    index === currentComponentIndex
                      ? "bg-blue-500 w-8"
                      : completedComponents.has(index)
                        ? "bg-green-500"
                        : "bg-gray-500 hover:bg-gray-400"
                  }
                `}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentComponentIndex === components.length - 1}
            style={{
              backgroundColor:
                currentComponentIndex === components.length - 1
                  ? "#059669"
                  : "#2563EB",
              color: "#FFFFFF",
              border: "2px solid",
              borderColor:
                currentComponentIndex === components.length - 1
                  ? "#10B981"
                  : "#3B82F6",
              opacity:
                currentComponentIndex === components.length - 1 ? 0.7 : 1,
              cursor:
                currentComponentIndex === components.length - 1
                  ? "not-allowed"
                  : "pointer",
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 font-semibold hover:opacity-90"
          >
            {currentComponentIndex === components.length - 1 ? (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                Done
              </>
            ) : (
              <>
                Next
                <ChevronRightIcon className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentConfigurationSection;
