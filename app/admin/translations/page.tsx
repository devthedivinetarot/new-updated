'use client'

import { useState, useEffect } from 'react'
import { translations as initialTranslations } from '@/translations'

type Language = 'english' | 'hinglish' | 'hindi'

interface TranslationEntry {
  key: string
  english: string
  hinglish: string
  hindi: string
}

export default function TranslationCMS() {
  const [data, setData] = useState<TranslationEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [filterLang, setFilterLang] = useState<'all' | 'missing' | 'complete'>('all')

   useEffect(() => {
     // Load translations from local store
     const eng = initialTranslations.english as Record<string, string>
     const hin = initialTranslations.hinglish as Record<string, string>
     const hi = initialTranslations.hindi as Record<string, string>
     
     const loaded: TranslationEntry[] = Object.keys(eng).map(key => ({
       key,
       english: eng[key] || '',
       hinglish: hin[key] || '',
       hindi: hi[key] || '',
     }))
     setData(loaded)
   }, [])

  const updateTranslation = (key: string, field: keyof TranslationEntry, value: string) => {
    setData(prev => prev.map(item => 
      item.key === key ? { ...item, [field]: value } : item
    ))
  }

  const saveChanges = async () => {
    setSaveStatus('saving')
    try {
      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: data })
      })

      if (response.ok) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      console.error('Save failed:', error)
      setSaveStatus('error')
    }
  }

  const filteredData = data.filter(item => {
    const matchesSearch = item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.english.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filterLang === 'missing') {
      return matchesSearch && (!item.hinglish || !item.hindi)
    } else if (filterLang === 'complete') {
      return matchesSearch && item.hinglish && item.hindi
    }
    return matchesSearch
  })

  const stats = {
    total: data.length,
    complete: data.filter(d => d.hinglish && d.hindi).length,
    missingHinglish: data.filter(d => !d.hinglish).length,
    missingHindi: data.filter(d => !d.hindi).length,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Translation Manager</h1>
            <p className="text-gray-600 mt-1">
              Manage all UI translations centrally. Changes reflect instantly on the site.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const csv = convertToCSV(data)
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'translations.csv'
                a.click()
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Export CSV
            </button>
            <button
              onClick={saveChanges}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-gray-600">Total Keys</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
            <div className="text-gray-600">Complete</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{stats.missingHinglish}</div>
            <div className="text-gray-600">Missing Hinglish</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">{stats.missingHindi}</div>
            <div className="text-gray-600">Missing Hindi</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search translations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value as any)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="missing">Missing Translations</option>
            <option value="complete">Complete</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-1/4">Key</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-1/4">English (Base)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-1/4">Hinglish</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-1/4">Hindi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item, idx) => (
                  <tr key={item.key} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800 break-all">
                        {item.key}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.english}
                        onChange={(e) => updateTranslation(item.key, 'english', e.target.value)}
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.hinglish}
                        onChange={(e) => updateTranslation(item.key, 'hinglish', e.target.value)}
                        placeholder="Hinglish translation..."
                        className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !item.hinglish ? 'bg-yellow-50 border-yellow-200' : ''
                        }`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.hindi}
                        onChange={(e) => updateTranslation(item.key, 'hindi', e.target.value)}
                        placeholder="हिंदी अनुवाद..."
                        className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !item.hindi ? 'bg-orange-50 border-orange-200' : ''
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No translations found. Run `node scripts/i18n-sync.js` to generate keys.
          </div>
        )}
      </div>
    </div>
  )
}

function convertToCSV(data: TranslationEntry[]): string {
  const headers = ['Key', 'English', 'Hinglish', 'Hindi']
  const rows = data.map(item => 
    [item.key, `"${item.english}"`, `"${item.hinglish}"`, `"${item.hindi}"`].join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}
