import React, { useState, useEffect } from 'react';
import { Employee, EmploymentType, EmployeeStatus } from '../../types';
import { Modal } from '../common/Modal';
import { FormInput } from '../common/FormInput';
import { SelectInput } from '../common/SelectInput';
import { Avatar } from '../common/Avatar';
import { DEPARTMENTS, DESIGNATIONS_BY_DEPARTMENT, AVATAR_PRESETS } from '../../data/mockData';
import {
  validateEmployeeForm,
  generateNextEmployeeId,
} from '../../utils/validators';
import { Upload, Sparkles, AlertTriangle } from 'lucide-react';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Employee, 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialEmployee?: Employee | null;
  existingEmployees: Employee[];
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialEmployee,
  existingEmployees,
}) => {
  const isEditing = Boolean(initialEmployee);

  const [formData, setFormData] = useState<Omit<Employee, 'createdAt' | 'updatedAt'>>({
    id: '',
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: 'Senior Frontend Architect',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-time',
    salary: 100000,
    reportingManagerId: '',
    status: 'Active',
    avatar: AVATAR_PRESETS[0],
    address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize or reset form
  useEffect(() => {
    if (initialEmployee) {
      setFormData({
        id: initialEmployee.id,
        name: initialEmployee.name,
        email: initialEmployee.email,
        phone: initialEmployee.phone,
        department: initialEmployee.department,
        designation: initialEmployee.designation,
        joiningDate: initialEmployee.joiningDate,
        employmentType: initialEmployee.employmentType,
        salary: initialEmployee.salary,
        reportingManagerId: initialEmployee.reportingManagerId || '',
        status: initialEmployee.status,
        avatar: initialEmployee.avatar,
        address: initialEmployee.address,
      });
      setCustomAvatarUrl(initialEmployee.avatar);
    } else {
      const newId = generateNextEmployeeId(existingEmployees);
      setFormData({
        id: newId,
        name: '',
        email: '',
        phone: '',
        department: 'Engineering',
        designation: DESIGNATIONS_BY_DEPARTMENT['Engineering'][0],
        joiningDate: new Date().toISOString().split('T')[0],
        employmentType: 'Full-time',
        salary: 95000,
        reportingManagerId: '',
        status: 'Active',
        avatar: AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)],
        address: '',
      });
      setCustomAvatarUrl('');
    }
    setErrors({});
    setIsDirty(false);
  }, [initialEmployee, isOpen, existingEmployees]);

  // Sync designation when department changes (if not already matching)
  const handleDepartmentChange = (dept: string) => {
    const availableDesignations = DESIGNATIONS_BY_DEPARTMENT[dept] || [];
    const newDesignation = availableDesignations[0] || '';
    setFormData(prev => ({
      ...prev,
      department: dept,
      designation: newDesignation,
    }));
    setIsDirty(true);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear error for that field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Image file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'Image size should be less than 2MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        handleInputChange('avatar', base64);
        setCustomAvatarUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateEmployeeForm(formData, existingEmployees, isEditing);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...formData,
        reportingManagerId: formData.reportingManagerId ? formData.reportingManagerId : null,
        salary: Number(formData.salary),
      });
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to save employee' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      onClose();
    }
  };

  // Potential reporting managers: active employees excluding self
  const eligibleManagers = existingEmployees.filter(
    emp => emp.status === 'Active' && emp.id !== formData.id
  );

  const designations = DESIGNATIONS_BY_DEPARTMENT[formData.department] || [formData.designation];

  return (
    <>
      <Modal
        isOpen={isOpen && !showCancelConfirm}
        onClose={handleCloseAttempt}
        title={isEditing ? `Edit Employee (${formData.id})` : 'Add New Employee'}
        subtitle={
          isEditing
            ? 'Update personal, employment, and compensation details.'
            : 'Fill in the information below to register a new employee.'
        }
        maxWidth="2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={handleCloseAttempt}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-xs transition-colors flex items-center gap-2 focus:ring-2 focus:ring-brand-500/20"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Employee'
              )}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Section: Profile Picture */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-5">
            <Avatar name={formData.name || 'User'} src={formData.avatar} size="xl" status={formData.status} />

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="text-xs font-semibold text-slate-700">Profile Picture</div>
              <p className="text-[11px] text-slate-500">
                Choose an avatar preset or upload a custom image (max 2MB).
              </p>

              {/* Avatar presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                {AVATAR_PRESETS.slice(0, 5).map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInputChange('avatar', presetUrl)}
                    className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                      formData.avatar === presetUrl ? 'border-brand-600 ring-2 ring-brand-300' : 'border-white'
                    }`}
                  >
                    <img src={presetUrl} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}

                <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 shadow-2xs">
                  <Upload className="w-3 h-3 text-slate-500" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section: Personal & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Employee ID"
              value={formData.id}
              disabled={isEditing}
              required
              helperText={isEditing ? 'Employee ID is permanent and cannot be modified' : 'Auto-generated unique ID'}
              error={errors.id}
              onChange={e => handleInputChange('id', e.target.value)}
            />

            <FormInput
              label="Full Name"
              placeholder="e.g. Sarah Jenkins"
              value={formData.name}
              required
              error={errors.name}
              onChange={e => handleInputChange('name', e.target.value)}
            />

            <FormInput
              label="Email Address"
              type="email"
              placeholder="sarah.jenkins@company.com"
              value={formData.email}
              required
              error={errors.email}
              onChange={e => handleInputChange('email', e.target.value)}
            />

            <FormInput
              label="Phone Number"
              placeholder="+1 (555) 234-5678"
              value={formData.phone}
              required
              error={errors.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
            />
          </div>

          {/* Section: Department & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput
              label="Department"
              value={formData.department}
              options={DEPARTMENTS}
              required
              error={errors.department}
              onChange={e => handleDepartmentChange(e.target.value)}
            />

            <SelectInput
              label="Designation"
              value={formData.designation}
              options={designations}
              required
              error={errors.designation}
              onChange={e => handleInputChange('designation', e.target.value)}
            />

            <FormInput
              label="Joining Date"
              type="date"
              value={formData.joiningDate}
              max={new Date().toISOString().split('T')[0]} // Cannot be in future
              required
              error={errors.joiningDate}
              helperText="Cannot be in the future"
              onChange={e => handleInputChange('joiningDate', e.target.value)}
            />

            <SelectInput
              label="Employment Type"
              value={formData.employmentType}
              options={['Full-time', 'Part-time', 'Contract', 'Intern']}
              required
              error={errors.employmentType}
              onChange={e => handleInputChange('employmentType', e.target.value as EmploymentType)}
            />
          </div>

          {/* Section: Compensation & Management */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Annual Salary ($ USD)"
              type="number"
              min="1"
              step="1000"
              placeholder="120000"
              value={formData.salary}
              required
              error={errors.salary}
              onChange={e => handleInputChange('salary', e.target.value)}
            />

            <SelectInput
              label="Reporting Manager"
              value={formData.reportingManagerId || ''}
              placeholder="None (Direct Report / C-Suite)"
              options={eligibleManagers.map(m => ({
                value: m.id,
                label: `${m.name} (${m.designation})`,
              }))}
              error={errors.reportingManagerId}
              helperText="Only active employees are eligible"
              onChange={e => handleInputChange('reportingManagerId', e.target.value)}
            />

            <SelectInput
              label="Employee Status"
              value={formData.status}
              options={['Active', 'Inactive']}
              required
              error={errors.status}
              onChange={e => handleInputChange('status', e.target.value as EmployeeStatus)}
            />

            <div className="sm:col-span-2">
              <FormInput
                label="Office / Residence Address"
                placeholder="742 Evergreen Terrace, Springfield, OR"
                value={formData.address}
                error={errors.address}
                onChange={e => handleInputChange('address', e.target.value)}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Confirmation when discarding unsaved edits */}
      <Modal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        title="Discard Unsaved Changes?"
        maxWidth="sm"
        footer={
          <>
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Continue Editing
            </button>
            <button
              onClick={() => {
                setShowCancelConfirm(false);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
            >
              Discard Changes
            </button>
          </>
        }
      >
        <p className="text-xs text-slate-600 leading-relaxed">
          You have unsaved changes in this form. If you close now, your edits will be lost.
        </p>
      </Modal>
    </>
  );
};
