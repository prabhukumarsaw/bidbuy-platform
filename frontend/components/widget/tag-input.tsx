import { useState, useRef, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  suggestions?: string[];
  maxTags?: number;
  placeholder?: string;
}

export function TagInput({
  tags,
  setTags,
  suggestions = [],
  maxTags = 10,
  placeholder = 'Add tag...',
}: TagInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      setTags([...tags, trimmedTag]);
      setInputValue('');
      setOpen(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="border rounded-md p-2 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <div
          key={tag}
          className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
        >
          <span className="text-sm">{tag}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => removeTag(tag)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      {tags.length < maxTags && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              size="sm"
              className="h-8 text-muted-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput
                ref={inputRef}
                value={inputValue}
                onValueChange={setInputValue}
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
              />
              <CommandEmpty>No suggestions found.</CommandEmpty>
              <CommandGroup>
                {suggestions
                  .filter(
                    (suggestion) =>
                      !tags.includes(suggestion.toLowerCase()) &&
                      suggestion
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                  )
                  .map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      value={suggestion}
                      onSelect={() => addTag(suggestion)}
                    >
                      {suggestion}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
