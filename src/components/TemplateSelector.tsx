import React from 'react';
import { Check } from 'lucide-react';

export type InvoiceTemplate = 'modern' | 'classic' | 'minimal' | 'professional';

interface TemplateSelectorProps {
  selectedTemplate: InvoiceTemplate;
  onTemplateChange: (template: InvoiceTemplate) => void;
}

const templates = [
  {
    id: 'modern' as InvoiceTemplate,
    name: 'Modern',
    description: 'Design modern dengan aksen warna dan layout yang clean',
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    accent: 'bg-blue-600'
  },
  {
    id: 'classic' as InvoiceTemplate,
    name: 'Classic',
    description: 'Template klasik dengan border dan styling tradisional',
    preview: 'bg-gradient-to-br from-gray-50 to-gray-100',
    accent: 'bg-gray-700'
  },
  {
    id: 'minimal' as InvoiceTemplate,
    name: 'Minimal',
    description: 'Design minimalis dengan fokus pada konten',
    preview: 'bg-white border-2 border-gray-200',
    accent: 'bg-black'
  },
  {
    id: 'professional' as InvoiceTemplate,
    name: 'Professional',
    description: 'Template profesional dengan header yang menonjol',
    preview: 'bg-gradient-to-br from-green-50 to-emerald-100',
    accent: 'bg-green-600'
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onTemplateChange }) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Pilih Template Invoice</label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onTemplateChange(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
            
            <div className={`h-20 w-full rounded-md mb-3 ${template.preview} flex items-center justify-center`}>
              <div className="text-center">
                <div className={`h-2 w-16 ${template.accent} rounded mb-2 mx-auto`}></div>
                <div className="h-1 w-12 bg-gray-300 rounded mx-auto"></div>
              </div>
            </div>
            
            <h3 className="font-medium text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;