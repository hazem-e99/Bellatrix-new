import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserGroupIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  UserPlusIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "../UI/Button";
import { Input } from "../UI/Input";
import Card, { CardContent, CardHeader, CardTitle } from "../UI/Card";
import Toast from "../UI/Toast";
import { useJsonData } from "../../hooks/useJsonData";
import Modal, { ModalFooter } from "../UI/Modal";
import FooterSettings from "../../pages/FooterSettings";
import AddAdminModal from "../AddAdminModal";

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState("permissions");
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);

  const [permissionSettings, setPermissionSettings] = useState({
    roles: [
      {
        id: 1,
        name: "Administrator",
        permissions: ["read", "write", "delete", "manage_users"],
        users: 1,
      },
      { id: 2, name: "Editor", permissions: ["read", "write"], users: 3 },
      { id: 3, name: "Viewer", permissions: ["read"], users: 5 },
    ],
    defaultRole: "Viewer",
    requireApproval: true,
    sessionTimeout: 24,
  });

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [roleForm, setRoleForm] = useState({ name: "", permissions: [] });

  const availablePermissions = ["read", "write", "delete", "manage_users"];

  const openAddRole = () => {
    setEditingRoleId(null);
    setRoleForm({ name: "", permissions: [] });
    setIsRoleModalOpen(true);
  };

  const openEditRole = (role) => {
    setEditingRoleId(role.id);
    setRoleForm({ name: role.name, permissions: [...role.permissions] });
    setIsRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setIsRoleModalOpen(false);
    setEditingRoleId(null);
    setRoleForm({ name: "", permissions: [] });
  };

  const togglePermissionInForm = (perm) => {
    setRoleForm((prev) => {
      const has = prev.permissions.includes(perm);
      return {
        ...prev,
        permissions: has
          ? prev.permissions.filter((p) => p !== perm)
          : [...prev.permissions, perm],
      };
    });
  };

  const saveRoleFromForm = () => {
    if (!roleForm.name.trim()) {
      showToast("error", "Role name is required");
      return;
    }
    if (roleForm.permissions.length === 0) {
      showToast("error", "At least one permission is required");
      return;
    }

    setPermissionSettings((prev) => {
      const nextRoles = [...prev.roles];
      if (editingRoleId != null) {
        const idx = nextRoles.findIndex((r) => r.id === editingRoleId);
        if (idx >= 0) {
          nextRoles[idx] = {
            ...nextRoles[idx],
            name: roleForm.name,
            permissions: roleForm.permissions,
          };
        }
        showToast("success", "Role updated");
      } else {
        const maxId = Math.max(0, ...nextRoles.map((r) => r.id));
        nextRoles.push({
          id: maxId + 1,
          name: roleForm.name,
          permissions: roleForm.permissions,
          users: 0,
        });
        showToast("success", "Role added");
      }
      return { ...prev, roles: nextRoles };
    });

    setIsRoleModalOpen(false);
  };

  const { data: persistedSettings, updateData } = useJsonData("settings.json");

  useEffect(() => {
    if (persistedSettings && typeof persistedSettings === "object") {
      if (persistedSettings.permissionSettings) {
        setPermissionSettings((prev) => ({
          ...prev,
          ...persistedSettings.permissionSettings,
        }));
      }
    }
  }, [persistedSettings]);

  const saveAllSettings = async () => {
    if (!updateData) return false;
    const payload = {
      permissionSettings,
    };
    try {
      const ok = await updateData(payload, "settings.json");
      return ok;
    } catch {
      return false;
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const handleSavePermissions = async () => {
    const ok = await saveAllSettings();
    showToast(
      ok ? "success" : "error",
      ok ? "Permission settings saved successfully" : "Failed to save settings"
    );
  };

  const handleAdminCreated = () => {
    showToast(
      "success",
      "Admin created successfully! Verification email sent."
    );
  };

  const renderPermissionSettings = () => (
    <div className="space-y-6">
      {/* User Roles & Permissions Section */}
      <Card className="bg-[var(--color-white-10)] border border-[var(--color-white-20)] shadow-lg">
        <CardHeader className="border-b border-[var(--color-white-10)] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30">
                <ShieldCheckIcon className="h-6 w-6 text-[var(--color-primary-light)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-inverse)] text-xl font-bold">
                  User Roles & Permissions
                </CardTitle>
                <p className="text-[var(--color-ww-100)] text-sm mt-1">
                  Manage user access levels and capabilities
                </p>
              </div>
            </div>
            <Button
              onClick={openAddRole}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text-inverse)] shadow-lg hover:shadow-[var(--color-primary)]/25 flex items-center gap-2 px-4 py-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add Role
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {permissionSettings.roles.map((role, roleIndex) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: roleIndex * 0.1 }}
                className="group relative p-5 bg-[var(--color-white-5)] hover:bg-[var(--color-white-10)] rounded-xl border border-[var(--color-white-10)] hover:border-[var(--color-white-20)] transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    {/* Role Header */}
                    <div className="flex items-center flex-wrap gap-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="h-5 w-5 text-[var(--color-primary-light)]" />
                        <h4 className="text-lg font-semibold text-[var(--color-text-inverse)]">
                          {role.name}
                        </h4>
                      </div>
                      {/* Stats Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-primary)]/15 text-[var(--color-primary-light)] rounded-full border border-[var(--color-primary)]/30">
                          <UserGroupIcon className="h-3.5 w-3.5" />
                          {role.users} user{role.users !== 1 ? "s" : ""}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--tw-purple-500)]/15 text-[var(--tw-purple-400)] rounded-full border border-[var(--tw-purple-500)]/30">
                          <ShieldCheckIcon className="h-3.5 w-3.5" />
                          {role.permissions.length} permission{role.permissions.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Permissions Tags */}
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission, permIndex) => (
                        <motion.span
                          key={permission}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.2,
                            delay: permIndex * 0.05,
                          }}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-[var(--tw-green-500)]/10 text-[var(--tw-green-400)] rounded-lg border border-[var(--tw-green-500)]/20"
                        >
                          <span className="w-1.5 h-1.5 bg-[var(--tw-green-400)] rounded-full mr-2" />
                          {permission.replace("_", " ")}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditRole(role)}
                      className="!text-white hover:!text-gray-900 hover:!bg-white border border-[var(--color-white-20)] hover:border-white transition-all duration-200 px-3 py-1.5"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="!text-red-400 hover:!text-white hover:!bg-red-600 border border-[var(--color-white-20)] hover:border-red-600 transition-all duration-200 px-3 py-1.5"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSavePermissions}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text-inverse)] shadow-lg hover:shadow-[var(--color-primary)]/25 px-8 py-3 font-medium"
        >
          Save Permission Settings
        </Button>
      </div>
    </div>
  );

  const tabs = [
    {
      id: "permissions",
      name: "Permissions",
      description: "User roles and access control",
      icon: ShieldCheckIcon,
    },
    {
      id: "footer",
      name: "Footer Settings",
      description: "Manage footer content and links",
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <div 
      className="admin-component space-y-6 text-[var(--color-text-inverse)]" 
      data-dashboard="true"
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-inverse)]">
            Settings Management
          </h1>
          <p className="text-[var(--color-ww-100)] mt-2">
            Configure system preferences and access control
          </p>
        </div>

        {/* Add Admin Button */}
        {activeTab === "permissions" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={() => setIsAddAdminModalOpen(true)}
              className="bg-[var(--tw-green-600)] hover:bg-[var(--tw-green-700)] text-[var(--color-text-inverse)] shadow-lg hover:shadow-[var(--tw-green-500)]/25 flex items-center gap-2 px-4 py-2.5"
            >
              <UserPlusIcon className="w-5 h-5" />
              Add Admin
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Tab Navigation */}
      <div className="border-b border-[var(--color-white-10)]">
        <nav className="flex gap-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 rounded-t-lg ${
                  isActive
                    ? "text-[var(--color-primary-light)] bg-[var(--color-white-5)]"
                    : "text-[var(--color-ww-100)] hover:text-[var(--color-text-inverse)] hover:bg-[var(--color-white-5)]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeSettingsTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="[&_input]:bg-[var(--color-white-5)] [&_input]:border-[var(--color-white-20)] [&_input]:text-[var(--color-text-inverse)] [&_textarea]:bg-[var(--color-white-5)] [&_textarea]:border-[var(--color-white-20)] [&_textarea]:text-[var(--color-text-inverse)]">
          {activeTab === "permissions" && renderPermissionSettings()}
          {activeTab === "footer" && <FooterSettings />}
        </div>
      </motion.div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, type: "", message: "" })}
        />
      )}

      {/* Role Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={closeRoleModal}
        title={editingRoleId != null ? "Edit Role" : "Add New Role"}
        className="border-[var(--color-white-20)] bg-[var(--color-brand-dark-navy)]"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-ww-100)] mb-2">
              Role Name
            </label>
            <Input
              placeholder="Enter role name"
              value={roleForm.name}
              onChange={(e) =>
                setRoleForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="bg-[var(--color-white-5)] border-[var(--color-white-20)] text-[var(--color-text-inverse)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-[var(--color-ww-100)]">
              Permissions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availablePermissions.map((perm) => {
                const checked = roleForm.permissions.includes(perm);
                return (
                  <motion.label
                    key={perm}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      checked
                        ? "bg-[var(--color-primary)]/15 border-[var(--color-primary)]/40 text-[var(--color-primary-light)]"
                        : "bg-[var(--color-white-5)] border-[var(--color-white-20)] text-[var(--color-ww-100)] hover:bg-[var(--color-white-10)] hover:border-[var(--color-white-30)]"
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => togglePermissionInForm(perm)}
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          checked
                            ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                            : "border-[var(--color-white-30)] bg-transparent"
                        }`}
                      >
                        {checked && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 text-[var(--color-text-inverse)]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </motion.svg>
                        )}
                      </div>
                    </div>
                    <span className="capitalize font-medium">
                      {perm.replace("_", " ")}
                    </span>
                  </motion.label>
                );
              })}
            </div>
          </div>
        </div>

        <ModalFooter className="mt-8 pt-6 border-t border-[var(--color-white-10)]">
          <Button
            variant="ghost"
            onClick={closeRoleModal}
            className="text-[var(--color-ww-100)] hover:text-[var(--color-text-inverse)] hover:bg-[var(--color-white-10)] border border-transparent hover:border-[var(--color-white-20)]"
          >
            Cancel
          </Button>
          <Button
            onClick={saveRoleFromForm}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text-inverse)] shadow-lg hover:shadow-[var(--color-primary)]/25"
          >
            {editingRoleId != null ? "Save Changes" : "Add Role"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add Admin Modal */}
      <AddAdminModal
        isOpen={isAddAdminModalOpen}
        onClose={() => setIsAddAdminModalOpen(false)}
        onSuccess={handleAdminCreated}
      />
    </div>
  );
};

export default SettingsManagement;
