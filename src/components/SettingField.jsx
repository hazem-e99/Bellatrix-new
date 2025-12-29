import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { validateField } from "../constants/settingsMap";
import {
  updateSetting,
  createSetting,
  getSettingByKey,
} from "../services/settingsApi";

/**
 * SettingField Component
 * Renders a single setting field with save/delete actions
 */
const SettingField = ({
  fieldDef,
  existingValue,
  existingId,
  onSaveSuccess,
}) => {
  // For phone_array, parse JSON array or use single value
  const parseInitialValue = (val, type) => {
    if (type === "phone_array") {
      if (!val) return [""];
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : [""];
      } catch {
        // If not JSON, treat as single phone
        return val ? [val] : [""];
      }
    }
    return val || "";
  };

  const [value, setValue] = useState(() => parseInitialValue(existingValue, fieldDef.dataType));
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Update value when existingValue changes (when data loads from API)
  useEffect(() => {
    setValue(parseInitialValue(existingValue, fieldDef.dataType));
    setIsDirty(false);
  }, [existingValue, fieldDef.dataType]);

  const {
    key,
    label,
    placeholder,
    dataType,
    category,
    isPublicDefault,
    description,
  } = fieldDef;

  /**
   * Handle value change
   */
  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsDirty(newValue !== (existingValue || ""));

    // Clear validation error on change
    if (validationError) {
      setValidationError(null);
    }
  };

  /**
   * Handle phone array item change
   */
  const handlePhoneChange = (index, newPhone) => {
    const newPhones = [...value];
    newPhones[index] = newPhone;
    setValue(newPhones);
    setIsDirty(true);

    if (validationError) {
      setValidationError(null);
    }
  };

  /**
   * Add new phone number
   */
  const addPhone = () => {
    setValue([...value, ""]);
    setIsDirty(true);
  };

  /**
   * Remove phone number
   */
  const removePhone = (index) => {
    if (value.length > 1) {
      const newPhones = value.filter((_, i) => i !== index);
      setValue(newPhones);
      setIsDirty(true);
    }
  };

  /**
   * Get value for saving (convert array to JSON string for phone_array)
   */
  const getValueForSave = () => {
    if (dataType === "phone_array") {
      const cleanedPhones = value.filter(phone => phone && phone.trim() !== "");
      return JSON.stringify(cleanedPhones);
    }
    return value || "";
  };

  /**
   * Validate current value
   */
  const validate = () => {
    const validation = validateField(key, value);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return false;
    }
    setValidationError(null);
    return true;
  };

  /**
   * Handle single field save
   */
  const handleSave = async () => {
    // Validate
    if (!validate()) {
      toast.error(`Validation failed: ${validationError}`);
      return;
    }

    console.log(` [SettingField] Saving field "${key}":`, {
      existingId,
      existingValue,
      newValue: value,
      willUpdate: !!existingId,
      willCreate: !existingId,
    });

    setIsSaving(true);

    try {
      const valueToSave = getValueForSave();

      if (existingId) {
        // UPDATE existing setting
        const payload = {
          id: existingId,
          key,
          value: valueToSave,
          description: description || "",
          category: category || "footer",
          isPublic: isPublicDefault !== undefined ? isPublicDefault : true,
          dataType: dataType === "phone_array" ? "string" : (dataType || "string"),
        };

        console.log(` [SettingField] PUT request for "${key}":`, payload);
        const response = await updateSetting(payload);

        if (response.success) {
          console.log(
            ` [SettingField] Update success for "${key}":`,
            response.data
          );
          toast.success(`${label} updated successfully`);
          setIsDirty(false);
          if (onSaveSuccess && response.data) {
            onSaveSuccess(response.data);
          }
        } else {
          console.error(
            ` [SettingField] Update failed for "${key}":`,
            response.message
          );
          toast.error(response.message || "Failed to update setting");
        }
      } else {
        // CREATE new setting OR UPDATE if exists
        // First check if key exists in database
        console.log(` [SettingField] Checking if key "${key}" exists...`);
        const existingSettingResponse = await getSettingByKey(key);

        if (existingSettingResponse.success && existingSettingResponse.data) {
          // Key exists in database - UPDATE instead of CREATE
          console.warn(
            ` [SettingField] Key "${key}" already exists in database. Performing UPDATE instead of CREATE.`
          );

          const existingSetting = existingSettingResponse.data;
          const payload = {
            id: existingSetting.id,
            key,
            value: valueToSave,
            description: description || existingSetting.description || "",
            category: category || existingSetting.category || "footer",
            isPublic:
              isPublicDefault !== undefined
                ? isPublicDefault
                : existingSetting.isPublic !== undefined
                ? existingSetting.isPublic
                : true,
            dataType: dataType === "phone_array" ? "string" : (dataType || existingSetting.dataType || "string"),
          };

          console.log(
            ` [SettingField] UPDATE request for existing key "${key}":`,
            payload
          );
          const response = await updateSetting(payload);

          if (response.success) {
            console.log(
              ` [SettingField] Update success for "${key}":`,
              response.data
            );
            toast.success(`${label} updated successfully`);
            setIsDirty(false);
            if (onSaveSuccess && response.data) {
              onSaveSuccess(response.data);
            }
          } else {
            console.error(
              ` [SettingField] Update failed for "${key}":`,
              response.message
            );
            toast.error(response.message || "Failed to update setting");
          }
        } else {
          // Key doesn't exist - CREATE new setting
          const payload = {
            key,
            value: valueToSave,
            description: description || "",
            category: category || "footer",
            isPublic: isPublicDefault !== undefined ? isPublicDefault : true,
            dataType: dataType === "phone_array" ? "string" : (dataType || "string"),
          };

          console.log(
            ` [SettingField] POST request for new key "${key}":`,
            payload
          );
          const response = await createSetting(payload);

          if (response.success) {
            console.log(
              ` [SettingField] Create success for "${key}":`,
              response.data
            );
            toast.success(`${label} created successfully`);
            setIsDirty(false);
            if (onSaveSuccess && response.data) {
              onSaveSuccess(response.data);
            }
          } else {
            console.error(
              ` [SettingField] Create failed for "${key}":`,
              response.message
            );
            toast.error(response.message || "Failed to create setting");
          }
        }
      }
    } catch (error) {
      console.error(` [SettingField] Exception for "${key}":`, error);
      toast.error(error.message || "An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  // Determine if field is a textarea
  const isTextarea = dataType === "text";
  
  // Determine if field is a phone array
  const isPhoneArray = dataType === "phone_array";

  // Check if this is a dynamic field (not in FOOTER_SETTINGS_MAP)
  const isDynamicField = fieldDef.description?.startsWith("Dynamic setting:");

  return (
    <div className="bg-[var(--color-white-5)] hover:bg-[var(--color-white-10)] rounded-xl border border-[var(--color-white-10)] hover:border-[var(--color-white-20)] p-4 transition-all duration-200">
      {/* Label and Description */}
      <div className="mb-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-inverse)] mb-1">
          {label}
          {fieldDef.validation?.required && (
            <span className="text-[var(--tw-red-400)] ml-1">*</span>
          )}
          {isDynamicField && (
            <span className="text-xs bg-[var(--tw-green-500)]/15 text-[var(--tw-green-400)] px-2 py-0.5 rounded-full border border-[var(--tw-green-500)]/30">
              Dynamic
            </span>
          )}
        </label>
        {description && (
          <p className="text-xs text-[var(--color-ww-100)] mb-2">
            {description}
          </p>
        )}
      </div>

      {/* Input Field */}
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {isPhoneArray ? (
            /* Phone Array Input */
            <div className="space-y-2">
              {Array.isArray(value) && value.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    placeholder={`${placeholder} ${index + 1}`}
                    disabled={isSaving}
                    className={`flex-1 px-4 py-2.5 border rounded-lg text-sm transition-all duration-200 bg-[var(--color-white-5)] text-[var(--color-text-inverse)] border-[var(--color-white-20)] placeholder-[var(--color-text-muted)]
                      ${
                        validationError
                          ? "border-[var(--tw-red-500)] focus:ring-[var(--tw-red-500)]/20 focus:border-[var(--tw-red-500)]"
                          : "focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                      }
                      ${isDirty ? "bg-[var(--tw-yellow-500)]/10 border-[var(--tw-yellow-500)]/30" : ""}
                      disabled:opacity-50 disabled:cursor-not-allowed
                      focus:outline-none focus:ring-2`}
                  />
                  {value.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhone(index)}
                      disabled={isSaving}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                      title="Remove phone"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPhone}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
              >
                <PlusIcon className="w-4 h-4" />
                Add Phone Number
              </button>
            </div>
          ) : isTextarea ? (
            <textarea
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              rows={3}
              disabled={isSaving}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-all duration-200 bg-[var(--color-white-5)] text-[var(--color-text-inverse)] border-[var(--color-white-20)] placeholder-[var(--color-text-muted)]
                ${
                  validationError
                    ? "border-[var(--tw-red-500)] focus:ring-[var(--tw-red-500)]/20 focus:border-[var(--tw-red-500)]"
                    : "focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                }
                ${isDirty ? "bg-[var(--tw-yellow-500)]/10 border-[var(--tw-yellow-500)]/30" : ""}
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2`}
            />
          ) : (
            <input
              type={
                dataType === "email"
                  ? "email"
                  : dataType === "url"
                  ? "url"
                  : "text"
              }
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              disabled={isSaving}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-all duration-200 bg-[var(--color-white-5)] text-[var(--color-text-inverse)] border-[var(--color-white-20)] placeholder-[var(--color-text-muted)]
                ${
                  validationError
                    ? "border-[var(--tw-red-500)] focus:ring-[var(--tw-red-500)]/20 focus:border-[var(--tw-red-500)]"
                    : "focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                }
                ${isDirty ? "bg-[var(--tw-yellow-500)]/10 border-[var(--tw-yellow-500)]/30" : ""}
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2`}
            />
          )}

          {/* Validation Error */}
          {validationError && (
            <div className="flex items-center gap-1 mt-2 text-xs text-[var(--tw-red-400)]">
              <XCircleIcon className="w-3.5 h-3.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Dirty Indicator */}
          {isDirty && !validationError && (
            <div className="flex items-center gap-1 mt-2 text-xs text-[var(--tw-yellow-400)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--tw-yellow-400)]"></span>
              <span>Unsaved changes</span>
            </div>
          )}

          {/* Success Indicator */}
          {!isDirty && existingId && (
            <div className="flex items-center gap-1 mt-2 text-xs text-[var(--tw-green-400)]">
              <CheckCircleSolid className="w-3.5 h-3.5" />
              <span>Saved</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="p-2.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-[var(--color-primary)]/25"
            title="Save"
          >
            {isSaving ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingField;
