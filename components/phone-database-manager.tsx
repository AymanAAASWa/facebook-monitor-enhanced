"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Phone,
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Upload,
  Database,
  Users,
  BarChart3,
  TestTube,
  Cloud,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  HardDrive,
} from "lucide-react"
import { phoneDatabaseService, type PhoneRecord, type DatabaseStats } from "@/lib/phone-database-service"

interface PhoneDatabaseManagerProps {
  darkMode: boolean
  language: "ar" | "en"
  userId: string
  onDatabaseLoaded?: () => void
}

export function PhoneDatabaseManager({ darkMode, language, userId, onDatabaseLoaded }: PhoneDatabaseManagerProps) {
  const [records, setRecords] = useState<PhoneRecord[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<PhoneRecord[]>([])
  const [stats, setStats] = useState<DatabaseStats>({
    totalRecords: 0,
    uniqueNumbers: 0,
    dataSize: 0,
    lastUpdated: new Date().toISOString(),
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingRecord, setEditingRecord] = useState<PhoneRecord | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // نموذج السجل الجديد
  const [newRecord, setNewRecord] = useState({
    name: "",
    phone: "",
    location: "",
    notes: "",
    source: "manual",
    verified: false,
    tags: [] as string[],
  })

  const t = {
    ar: {
      title: "مدير قاعدة بيانات الأرقام",
      overview: "نظرة عامة",
      records: "السجلات",
      search: "البحث",
      settings: "الإعدادات",
      totalRecords: "إجمالي السجلات",
      uniqueNumbers: "الأرقام الفريدة",
      dataSize: "حجم البيانات",
      lastUpdated: "آخر تحديث",
      bytes: "بايت",
      addRecord: "إضافة سجل",
      editRecord: "تعديل السجل",
      deleteRecord: "حذف السجل",
      name: "الاسم",
      phone: "رقم الهاتف",
      location: "الموقع",
      notes: "ملاحظات",
      source: "المصدر",
      verified: "موثق",
      tags: "العلامات",
      actions: "الإجراءات",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      searchPlaceholder: "ابحث في الأسماء أو الأرقام...",
      noResults: "لا توجد نتائج",
      loadTestData: "تحميل بيانات تجريبية",
      clearAll: "مسح الكل",
      exportData: "تصدير البيانات",
      importData: "استيراد البيانات",
      cloudSync: "مزامنة السحابة",
      loading: "جاري التحميل...",
      saving: "جاري الحفظ...",
      success: "تم بنجاح!",
      error: "حدث خطأ",
      confirmDelete: "هل أنت متأكد من حذف هذا السجل؟",
      confirmClear: "هل أنت متأكد من مسح جميع البيانات؟",
      fileUploaded: "تم رفع الملف بنجاح",
      invalidFile: "ملف غير صالح",
      syncSuccess: "تم المزامنة بنجاح",
      syncError: "خطأ في المزامنة",
    },
    en: {
      title: "Phone Database Manager",
      overview: "Overview",
      records: "Records",
      search: "Search",
      settings: "Settings",
      totalRecords: "Total Records",
      uniqueNumbers: "Unique Numbers",
      dataSize: "Data Size",
      lastUpdated: "Last Updated",
      bytes: "bytes",
      addRecord: "Add Record",
      editRecord: "Edit Record",
      deleteRecord: "Delete Record",
      name: "Name",
      phone: "Phone Number",
      location: "Location",
      notes: "Notes",
      source: "Source",
      verified: "Verified",
      tags: "Tags",
      actions: "Actions",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      searchPlaceholder: "Search names or numbers...",
      noResults: "No results found",
      loadTestData: "Load Test Data",
      clearAll: "Clear All",
      exportData: "Export Data",
      importData: "Import Data",
      cloudSync: "Cloud Sync",
      loading: "Loading...",
      saving: "Saving...",
      success: "Success!",
      error: "Error occurred",
      confirmDelete: "Are you sure you want to delete this record?",
      confirmClear: "Are you sure you want to clear all data?",
      fileUploaded: "File uploaded successfully",
      invalidFile: "Invalid file",
      syncSuccess: "Sync successful",
      syncError: "Sync error",
    },
  }

  const text = t[language]

  useEffect(() => {
    loadData()
  }, [userId])

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = phoneDatabaseService.search(searchQuery)
      setSearchResults(results.records)
    } else {
      setSearchResults(records)
    }
  }, [searchQuery, records])

  const loadData = async () => {
    setLoading(true)
    try {
      // تحميل من Firebase أولاً
      const result = await phoneDatabaseService.loadFromFirebase(userId)
      if (result.success) {
        const allRecords = phoneDatabaseService.getAllRecords()
        setRecords(allRecords)
        loadDatabaseStats()
        onDatabaseLoaded?.()
      }
    } catch (error) {
      console.error("Error loading data:", error)
      showMessage("error", "خطأ في تحميل البيانات")
    } finally {
      setLoading(false)
    }
  }

  const loadDatabaseStats = () => {
    try {
      const dbStats = phoneDatabaseService.getStats()
      setStats(dbStats)
    } catch (error) {
      console.error("Error loading database stats:", error)
      showMessage("error", "خطأ في تحميل إحصائيات قاعدة البيانات")
    }
  }

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleAddRecord = async () => {
    try {
      const record = phoneDatabaseService.addRecord(newRecord)
      setRecords(phoneDatabaseService.getAllRecords())
      loadDatabaseStats()
      setNewRecord({
        name: "",
        phone: "",
        location: "",
        notes: "",
        source: "manual",
        verified: false,
        tags: [],
      })
      setIsAddDialogOpen(false)
      showMessage("success", "تم إضافة السجل بنجاح")
    } catch (error) {
      showMessage("error", "خطأ في إضافة السجل")
    }
  }

  const handleEditRecord = async () => {
    if (!editingRecord) return

    try {
      const updated = phoneDatabaseService.updateRecord(editingRecord.id, editingRecord)
      if (updated) {
        setRecords(phoneDatabaseService.getAllRecords())
        loadDatabaseStats()
        setEditingRecord(null)
        setIsEditDialogOpen(false)
        showMessage("success", "تم تحديث السجل بنجاح")
      }
    } catch (error) {
      showMessage("error", "خطأ في تحديث السجل")
    }
  }

  const handleDeleteRecord = async (id: string) => {
    try {
      const deleted = phoneDatabaseService.deleteRecord(id)
      if (deleted) {
        setRecords(phoneDatabaseService.getAllRecords())
        loadDatabaseStats()
        showMessage("success", "تم حذف السجل بنجاح")
      }
    } catch (error) {
      showMessage("error", "خطأ في حذف السجل")
    }
  }

  const handleLoadTestData = () => {
    phoneDatabaseService.loadTestData()
    setRecords(phoneDatabaseService.getAllRecords())
    loadDatabaseStats()
    showMessage("success", "تم تحميل البيانات التجريبية")
  }

  const handleClearAll = () => {
    phoneDatabaseService.clearAll()
    setRecords([])
    loadDatabaseStats()
    showMessage("success", "تم مسح جميع البيانات")
  }

  const handleExportData = () => {
    try {
      const jsonData = phoneDatabaseService.exportToJSON()
      const blob = new Blob([jsonData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `phone-database-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      showMessage("success", "تم تصدير البيانات بنجاح")
    } catch (error) {
      showMessage("error", "خطأ في تصدير البيانات")
    }
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadProgress(0)
    try {
      const result = await phoneDatabaseService.importFromFile(file)
      if (result.success) {
        setRecords(phoneDatabaseService.getAllRecords())
        loadDatabaseStats()
        showMessage("success", result.message)
      } else {
        showMessage("error", result.message)
      }
    } catch (error) {
      showMessage("error", "خطأ في استيراد الملف")
    } finally {
      setUploadProgress(0)
      event.target.value = ""
    }
  }

  const handleCloudSync = async () => {
    setSaving(true)
    try {
      const result = await phoneDatabaseService.saveToFirebase(userId)
      if (result.success) {
        showMessage("success", "تم المزامنة مع السحابة بنجاح")
      } else {
        showMessage("error", result.error || "خطأ في المزامنة")
      }
    } catch (error) {
      showMessage("error", "خطأ في المزامنة مع السحابة")
    } finally {
      setSaving(false)
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString(language === "ar" ? "ar-SA" : "en-US")
  }

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <Card
          className={`border-2 ${
            message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={message.type === "success" ? "text-green-700" : "text-red-700"}>{message.text}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            {text.title}
            <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
              <Cloud className="w-3 h-3 mr-1" />
              {text.cloudSync}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            {text.overview}
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {text.records}
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            {text.search}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            {text.settings}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{text.totalRecords}</p>
                    <p className="text-2xl font-bold">{stats.totalRecords}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{text.uniqueNumbers}</p>
                    <p className="text-2xl font-bold">{stats.uniqueNumbers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <HardDrive className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{text.dataSize}</p>
                    <p className="text-2xl font-bold">{formatBytes(stats.dataSize)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <RefreshCw className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{text.lastUpdated}</p>
                    <p className="text-sm font-medium">{formatDate(stats.lastUpdated)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Records Tab */}
        <TabsContent value="records">
          <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{text.records}</CardTitle>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      {text.addRecord}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{text.addRecord}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">{text.name}</Label>
                        <Input
                          id="name"
                          value={newRecord.name}
                          onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{text.phone}</Label>
                        <Input
                          id="phone"
                          value={newRecord.phone}
                          onChange={(e) => setNewRecord({ ...newRecord, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">{text.location}</Label>
                        <Input
                          id="location"
                          value={newRecord.location}
                          onChange={(e) => setNewRecord({ ...newRecord, location: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">{text.notes}</Label>
                        <Textarea
                          id="notes"
                          value={newRecord.notes}
                          onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="verified"
                          checked={newRecord.verified}
                          onCheckedChange={(checked) => setNewRecord({ ...newRecord, verified: checked })}
                        />
                        <Label htmlFor="verified">{text.verified}</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        {text.cancel}
                      </Button>
                      <Button onClick={handleAddRecord} disabled={!newRecord.name || !newRecord.phone}>
                        {text.save}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-2">{text.loading}</span>
                </div>
              ) : records.length === 0 ? (
                <div className="text-center p-8">
                  <Database className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد سجلات</h3>
                  <p className="text-gray-500 mb-4">ابدأ بإضافة سجل جديد أو تحميل البيانات التجريبية</p>
                  <Button onClick={handleLoadTestData} variant="outline">
                    <TestTube className="w-4 h-4 mr-2" />
                    {text.loadTestData}
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{text.name}</TableHead>
                      <TableHead>{text.phone}</TableHead>
                      <TableHead>{text.location}</TableHead>
                      <TableHead>{text.verified}</TableHead>
                      <TableHead>{text.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.name}</TableCell>
                        <TableCell>{record.phone}</TableCell>
                        <TableCell>{record.location}</TableCell>
                        <TableCell>
                          {record.verified ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              موثق
                            </Badge>
                          ) : (
                            <Badge variant="secondary">غير موثق</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingRecord(record)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{text.deleteRecord}</AlertDialogTitle>
                                  <AlertDialogDescription>{text.confirmDelete}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{text.cancel}</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteRecord(record.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    {text.delete}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{text.editRecord}</DialogTitle>
              </DialogHeader>
              {editingRecord && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">{text.name}</Label>
                    <Input
                      id="edit-name"
                      value={editingRecord.name}
                      onChange={(e) => setEditingRecord({ ...editingRecord, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">{text.phone}</Label>
                    <Input
                      id="edit-phone"
                      value={editingRecord.phone}
                      onChange={(e) => setEditingRecord({ ...editingRecord, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-location">{text.location}</Label>
                    <Input
                      id="edit-location"
                      value={editingRecord.location || ""}
                      onChange={(e) => setEditingRecord({ ...editingRecord, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-notes">{text.notes}</Label>
                    <Textarea
                      id="edit-notes"
                      value={editingRecord.notes || ""}
                      onChange={(e) => setEditingRecord({ ...editingRecord, notes: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-verified"
                      checked={editingRecord.verified || false}
                      onCheckedChange={(checked) => setEditingRecord({ ...editingRecord, verified: checked })}
                    />
                    <Label htmlFor="edit-verified">{text.verified}</Label>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  {text.cancel}
                </Button>
                <Button onClick={handleEditRecord}>{text.save}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search">
          <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                {text.search}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={text.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                {searchResults.length === 0 ? (
                  <div className="text-center p-8">
                    <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">{text.noResults}</h3>
                    <h3 className="text-lg font-semibold mb-2">{text.noResults}</h3>
                    <p className="text-gray-500">جرب البحث بكلمات مختلفة</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">تم العثور على {searchResults.length} نتيجة</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{text.name}</TableHead>
                          <TableHead>{text.phone}</TableHead>
                          <TableHead>{text.location}</TableHead>
                          <TableHead>{text.verified}</TableHead>
                          <TableHead>{text.actions}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.name}</TableCell>
                            <TableCell>{record.phone}</TableCell>
                            <TableCell>{record.location}</TableCell>
                            <TableCell>
                              {record.verified ? (
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  موثق
                                </Badge>
                              ) : (
                                <Badge variant="secondary">غير موثق</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingRecord(record)
                                    setIsEditDialogOpen(true)
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>{text.deleteRecord}</AlertDialogTitle>
                                      <AlertDialogDescription>{text.confirmDelete}</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>{text.cancel}</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteRecord(record.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        {text.delete}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card className={`${darkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95"} backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                {text.settings}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Data Management */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">إدارة البيانات</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button onClick={handleLoadTestData} variant="outline" className="flex-1 bg-transparent">
                      <TestTube className="w-4 h-4 mr-2" />
                      {text.loadTestData}
                    </Button>

                    <Button onClick={handleExportData} variant="outline" className="flex-1 bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      {text.exportData}
                    </Button>

                    <div className="flex-1">
                      <input
                        type="file"
                        accept=".json,.csv"
                        onChange={handleImportData}
                        className="hidden"
                        id="import-file"
                      />
                      <Button
                        onClick={() => document.getElementById("import-file")?.click()}
                        variant="outline"
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {text.importData}
                      </Button>
                    </div>

                    <Button
                      onClick={handleCloudSync}
                      disabled={saving}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Cloud className="w-4 h-4 mr-2" />}
                      {saving ? text.saving : text.cloudSync}
                    </Button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-4 pt-6 border-t border-red-200">
                  <h3 className="text-lg font-semibold text-red-600">منطقة الخطر</h3>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        {text.clearAll}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{text.clearAll}</AlertDialogTitle>
                        <AlertDialogDescription>{text.confirmClear}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{text.cancel}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAll} className="bg-red-600 hover:bg-red-700">
                          {text.clearAll}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Upload Progress */}
                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>جاري الرفع...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
