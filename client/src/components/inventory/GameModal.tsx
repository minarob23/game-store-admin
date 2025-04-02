import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Game, gameFormSchema, platformSchema } from "@shared/schema";
import { genreOptions } from "@/lib/utils";
import { ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  game?: Game;
  title: string;
}

export default function GameModal({ open, onOpenChange, onSave, game, title }: GameModalProps) {
  const { toast } = useToast();
  // Create form with validation
  const form = useForm({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      title: "",
      description: "",
      releaseDate: "",
      platforms: {
        pc: false,
        ps5: false,
        ps4: false,
        ps3: false,
        xsx: false,
        xone: false,
        x360: false,
        switch: false,
        wiiu: false,
        wii: false,
        "3ds": false
      },
      genre: "none",
      developer: "",
      publisher: "",
      price: 0,
      stock: 0,
      imageUrl: ""
    }
  });

  // Update form when editing a game
  useEffect(() => {
    if (game) {
      const releaseDateStr = typeof game.releaseDate === 'string' 
        ? game.releaseDate 
        : new Date(game.releaseDate).toISOString().split('T')[0];
        
      form.reset({
        ...game,
        releaseDate: releaseDateStr,
        platforms: game.platforms as any
      });
    } else {
      form.reset({
        title: "",
        description: "",
        releaseDate: "",
        platforms: {
          pc: false,
          ps5: false,
          ps4: false,
          ps3: false,
          xsx: false,
          xone: false,
          x360: false,
          switch: false,
          wiiu: false,
          wii: false,
          "3ds": false
        },
        genre: "none",
        developer: "",
        publisher: "",
        price: 0,
        stock: 0,
        imageUrl: ""
      });
    }
  }, [game, form, open]);

  const onSubmit = (data: any) => {
    // Convert releaseDate string to Date if needed
    if (typeof data.releaseDate === 'string') {
      data.releaseDate = new Date(data.releaseDate);
    }
    
    // Convert price to number
    data.price = parseFloat(data.price);
    
    // Convert stock to integer
    data.stock = parseInt(data.stock);
    
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-poppins">{title}</DialogTitle>
          <DialogDescription>
            Fill in the details for this game. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div 
                          className="flex items-center justify-center h-40 bg-muted rounded-lg border-2 border-dashed border-border relative cursor-pointer"
                          onClick={() => document.getElementById('imageUpload')?.click()}
                        >
                          {field.value ? (
                            <img 
                              src={field.value} 
                              alt="Game cover" 
                              className="h-full w-full object-contain rounded-lg"
                            />
                          ) : (
                            <div className="text-center">
                              <ImagePlus className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Upload Game Cover Image</p>
                              <p className="text-xs text-muted-foreground/70 mt-1">PNG, JPG or GIF (Max. 2MB)</p>
                            </div>
                          )}
                          <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 2 * 1024 * 1024) {
                                  // Show error for files larger than 2MB
                                  toast({
                                    variant: "destructive",
                                    title: "Error",
                                    description: "Image size must be less than 2MB"
                                  });
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onload = () => {
                                  field.onChange(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Game Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter game title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Release Date */}
              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Developer */}
              <FormField
                control={form.control}
                name="developer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Developer *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter developer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Publisher */}
              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publisher *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter publisher name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Stock */}
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Genre */}
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Genre *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genreOptions.map((option) => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Platforms */}
              <FormItem className="md:col-span-2">
                <FormLabel>Platforms *</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {/* PC */}
                  <FormField
                    control={form.control}
                    name="platforms.pc"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label className="text-sm">PC</label>
                      </div>
                    )}
                  />
                  
                  {/* PlayStation Family */}
                  <FormField
                    control={form.control}
                    name="platforms.ps5"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label className="text-sm">PS5</label>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platforms.ps4"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label className="text-sm">PS4</label>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platforms.ps3"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label className="text-sm">PS3</label>
                      </div>
                    )}
                  />
                  
                  {/* Xbox Family */}
                  <FormField
                    control={form.control}
                    name="platforms.xsx"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label className="text-sm">Xbox Series X</label>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platforms.xone"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label className="text-sm">Xbox One</label>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platforms.x360"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label className="text-sm">Xbox 360</label>
                      </div>
                    )}
                  />
                  
                  {/* Nintendo Family */}
                  <FormField
                    control={form.control}
                    name="platforms.switch"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label className="text-sm">Nintendo Switch</label>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platforms.wiiu"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label className="text-sm">Wii U</label>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platforms.wii"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label className="text-sm">Wii</label>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platforms.3ds"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label className="text-sm">Nintendo 3DS</label>
                      </div>
                    )}
                  />
                </div>
                <FormMessage />
              </FormItem>
              
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a detailed description of the game"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-secondary">
                Save Game
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
