"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Sample data for documents with batch numbers
const documents = [
  // {
//     batchNumber: "12345",
//     label: "Document 1",
//   },
//   {
//     batchNumber: "67890",
//     label: "Document 2",
//   },

  // Add more documents as needed
]

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  // Function to handle search query change
  const handleSearch = (query: string) => {
    setValue(query)
  }

  // Filter documents based on the search query
  const filteredDocuments = documents.filter(document =>
    document.batchNumber.includes(value)
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? filteredDocuments.length > 0
              ? filteredDocuments[0].batchNumber // Display the first matching batch number
              : "No matching batch number"
            : "Search Batch Number"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Batch Number" onInput={e => handleSearch(e.target.value)} />
          <CommandEmpty>No document found.</CommandEmpty>
          <CommandGroup>
            {filteredDocuments.map((document) => (
              <CommandItem
                key={document.batchNumber}
                value={document.batchNumber}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === document.batchNumber ? "opacity-100" : "opacity-0"
                  )}
                />
                {document.batchNumber}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
export default ComboboxDemo;
