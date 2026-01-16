'use client';

import { useEffect, useState } from 'react';

interface Employee {
  id: number;
  name: string;
  email: string;
  title: string;
  department: string;
  performance_rating?: number;
  potential?: string;
}

interface EmployeeListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  employees: Employee[];
  color?: string;
}

export default function EmployeeListModal({
  isOpen,
  onClose,
  title,
  description,
  employees,
  color = 'indigo'
}: EmployeeListModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setTimeout(() => setIsVisible(false), 300);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const colorClasses = {
    green: {
      border: 'border-green-500',
      bg: 'bg-green-500',
      text: 'text-green-600',
      hover: 'hover:bg-green-50',
      hoverBorder: 'hover:border-green-300',
      badge: 'bg-green-100 text-green-700'
    },
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-500',
      text: 'text-blue-600',
      hover: 'hover:bg-blue-50',
      hoverBorder: 'hover:border-blue-300',
      badge: 'bg-blue-100 text-blue-700'
    },
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-500',
      text: 'text-purple-600',
      hover: 'hover:bg-purple-50',
      hoverBorder: 'hover:border-purple-300',
      badge: 'bg-purple-100 text-purple-700'
    },
    teal: {
      border: 'border-teal-500',
      bg: 'bg-teal-500',
      text: 'text-teal-600',
      hover: 'hover:bg-teal-50',
      hoverBorder: 'hover:border-teal-300',
      badge: 'bg-teal-100 text-teal-700'
    },
    gray: {
      border: 'border-gray-500',
      bg: 'bg-gray-500',
      text: 'text-gray-600',
      hover: 'hover:bg-gray-50',
      hoverBorder: 'hover:border-gray-300',
      badge: 'bg-gray-100 text-gray-700'
    },
    amber: {
      border: 'border-amber-500',
      bg: 'bg-amber-500',
      text: 'text-amber-600',
      hover: 'hover:bg-amber-50',
      hoverBorder: 'hover:border-amber-300',
      badge: 'bg-amber-100 text-amber-700'
    },
    cyan: {
      border: 'border-cyan-500',
      bg: 'bg-cyan-500',
      text: 'text-cyan-600',
      hover: 'hover:bg-cyan-50',
      hoverBorder: 'hover:border-cyan-300',
      badge: 'bg-cyan-100 text-cyan-700'
    },
    slate: {
      border: 'border-slate-500',
      bg: 'bg-slate-500',
      text: 'text-slate-600',
      hover: 'hover:bg-slate-50',
      hoverBorder: 'hover:border-slate-300',
      badge: 'bg-slate-100 text-slate-700'
    },
    red: {
      border: 'border-red-500',
      bg: 'bg-red-500',
      text: 'text-red-600',
      hover: 'hover:bg-red-50',
      hoverBorder: 'hover:border-red-300',
      badge: 'bg-red-100 text-red-700'
    },
    indigo: {
      border: 'border-indigo-500',
      bg: 'bg-indigo-500',
      text: 'text-indigo-600',
      hover: 'hover:bg-indigo-50',
      hoverBorder: 'hover:border-indigo-300',
      badge: 'bg-indigo-100 text-indigo-700'
    }
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.indigo;

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Modal */}
      <div
        className={`relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className={`border-b-4 ${colors.border} p-6 rounded-t-2xl`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 id="modal-title" className={`text-2xl font-bold ${colors.text} mb-2 flex items-center gap-3`}>
                <span className="text-3xl animate-bounce">✨</span>
                {title}
              </h2>
              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.badge}`}>
                  {employees.length} {employees.length === 1 ? 'Employee' : 'Employees'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all hover:rotate-90 duration-200"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          {employees.length > 3 && (
            <div className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, title, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Employee List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500">No employees found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEmployees.map((employee, index) => (
                <div
                  key={employee.id}
                  className={`group bg-white border-2 border-gray-200 rounded-xl p-4 transition-all duration-200 ${colors.hover} ${colors.hoverBorder} hover:shadow-lg hover:scale-[1.02] cursor-pointer`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: isOpen ? 'slideInRight 0.3s ease-out forwards' : 'none'
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-semibold ${colors.text} group-hover:underline`}>
                          {employee.name}
                        </h3>
                        {employee.performance_rating && (
                          <div className="flex-shrink-0">
                            <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${colors.badge}`}>
                              ⭐ {employee.performance_rating.toFixed(1)}
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{employee.title}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          📧 {employee.email}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          🏢 {employee.department}
                        </span>
                        {employee.potential && (
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            employee.potential === 'high' ? 'bg-green-100 text-green-700' :
                            employee.potential === 'medium' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            💡 {employee.potential.charAt(0).toUpperCase() + employee.potential.slice(1)} Potential
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 rounded-b-2xl bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {filteredEmployees.length} of {employees.length} employees
            </p>
            <button
              onClick={onClose}
              className={`px-6 py-2 ${colors.bg} text-white rounded-lg hover:opacity-90 transition-all hover:scale-105 font-medium shadow-md`}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
