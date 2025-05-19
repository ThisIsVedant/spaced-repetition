"use client"

import type React from "react"

import { useState } from "react"
import { useSpacedRep } from "@/components/spaced-rep-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Download, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Card } from "@/lib/types"
import { parseCSV, validateImportedCards } from "@/lib/import-export"
import { Loader } from "@/components/ui/loader"
import toast, {Toaster} from "react-hot-toast";

interface ImportExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportExportDialog({ open, onOpenChange }: ImportExportDialogProps) {
  const { cards, importCards, exportCards, isImporting } = useSpacedRep()
  const [importType, setImportType] = useState<"json" | "csv">("json")
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0])
      setImportError(null)
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      setImportError("Please select a file to import.")
      return
    }

    try {
      const fileContent = await importFile.text()
      let importedCards: Card[] = []

      if (importType === "json") {
        try {
          importedCards = JSON.parse(fileContent)
        } catch (e) {
          setImportError("Invalid JSON file. Please check the file format.")
          return
        }
      } else if (importType === "csv") {
        try {
          importedCards = parseCSV(fileContent)
        } catch (e) {
          setImportError("Invalid CSV file. Please check the file format.")
          return
        }
      }

      const validationError = validateImportedCards(importedCards)
      if (validationError) {
        setImportError(validationError)
        return
      }

      await importCards(importedCards)
      toast.success(`Imported ${importedCards.length} cards successfully!`)

      setImportFile(null)

      setTimeout(() => {
        onOpenChange(false)
      }, 500)
    } catch (error) {
      setImportError("An error occurred while importing. Please try again.")
    }
  }

  const handleExport = (format: "json" | "csv") => {
    const exportData = exportCards(format)
    const fileType = format === "json" ? "application/json" : "text/csv"
    const fileName = `spacerep-cards.${format}`

    const blob = new Blob([exportData], { type: fileType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success(`Exported cards as ${format.toUpperCase()}`)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !isImporting && onOpenChange(newOpen)}>
      <Toaster
          position="top-center"
          toastOptions={{
            style: {
              border: '2px solid #6366f1',
              padding: '16px',
              color: '#fff',
              background: '#111827',
              fontWeight: 'bold',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#1F2937',
              },
            },
          }}
      />
      <DialogContent className="sm:max-w-[500px] gradient-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text  ">
            Import/Export Flashcards
          </DialogTitle>
          <DialogDescription>
            Import cards from a file or export your current cards to share or back up.
          </DialogDescription>
        </DialogHeader>

        {isImporting ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <Loader size="lg" className="border-primary" />
            <p className="text-center font-medium">Importing your cards...</p>
          </div>
        ) : (
          <Tabs defaultValue="import" className="w-full">
            <TabsList className="grid w-full grid-cols-2 gradient-primary">
              <TabsTrigger value="import" className="data-[state=active]:bg-white/20">
                <Upload className="mr-2 h-4 w-4" /> Import
              </TabsTrigger>
              <TabsTrigger value="export" className="data-[state=active]:bg-white/20">
                <Download className="mr-2 h-4 w-4" /> Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="import" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="importType">Import Format</Label>
                  <RadioGroup
                    id="importType"
                    value={importType}
                    onValueChange={(value) => setImportType(value as "json" | "csv")}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="json" id="json" />
                      <Label htmlFor="json">JSON</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="csv" id="csv" />
                      <Label htmlFor="csv">CSV</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept={importType === "json" ? ".json" : ".csv"}
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    {importType === "json"
                      ? "Expects a JSON array of cards with front and back properties."
                      : "Expects a CSV file with 'front' and 'back' columns."}
                  </p>
                </div>

                {importError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{importError}</AlertDescription>
                  </Alert>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleImport}
                  disabled={!importFile || isImporting}
                  className="gradient-primary text-white hover:opacity-90 transition-opacity"
                >
                  Import Cards
                </Button>
              </DialogFooter>
            </TabsContent>

            <TabsContent value="export" className="space-y-4 pt-4">
              <div className="space-y-4">
                <p>Export your {cards.length} flashcards to save or share with others.</p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="flex-1 gradient-primary text-white hover:opacity-90 transition-opacity"
                    onClick={() => handleExport("json")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export as JSON
                  </Button>
                  <Button
                    className="flex-1 gradient-secondary text-white hover:opacity-90 transition-opacity"
                    onClick={() => handleExport("csv")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export as CSV
                  </Button>
                </div>

                <div className="text-sm space-y-2 pt-2">
                  <h4 className="font-medium">Format Details:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      <strong>JSON</strong>: Includes all card data in a structured format. Best for complete backups.
                    </li>
                    <li>
                      <strong>CSV</strong>: Simple format with front and back fields. Best for sharing or importing to
                      other apps.
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
