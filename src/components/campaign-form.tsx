'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AIAssistant from './ai-assistant';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const milestoneSchema = z.object({
  title: z.string().min(3, 'Milestone title must be at least 3 characters.'),
  description: z.string().min(10, 'Milestone description must be at least 10 characters.'),
  targetDate: z.date({ required_error: 'A target date is required.' }),
});

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }).max(100, {
    message: 'Title must not exceed 100 characters.'
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }).max(5000, {
    message: 'Description must not exceed 5000 characters.'
  }),
  goal: z.coerce.number().min(0.01, {
    message: 'Funding goal must be at least 0.01 ETH.',
  }),
  deadline: z.date({
    required_error: 'A deadline is required.',
  }).min(new Date(), { message: 'Deadline must be in the future.' }),
  milestones: z.array(milestoneSchema).optional(),
});

export default function CampaignForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      goal: 0.1,
      milestones: [],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'milestones',
  });

  const descriptionValue = form.watch('description');

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);
    toast({ title: 'Creating Campaign...', description: 'Please wait while we submit your campaign to the blockchain.' });

    setTimeout(() => {
      setIsLoading(false);
      toast({ title: 'Campaign Created!', description: 'Your campaign is now live.' });
      router.push('/');
    }, 3000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Campaign Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., My Awesome Tech Project" {...field} />
                </FormControl>
                <FormDescription>
                  This is the main title of your project. Make it catchy!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Campaign Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your project in detail..." className="min-h-[200px]" {...field} />
                </FormControl>
                <FormDescription>
                  Explain why your project is amazing and why people should back it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Project Roadmap (Optional)</CardTitle>
              <FormDescription>
                  Define milestones for your project. Funds can be released as you complete each one, increasing backer trust.
              </FormDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                        <h4 className="font-semibold">Milestone {index + 1}</h4>
                        <FormField
                            control={form.control}
                            name={`milestones.${index}.title`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl><Input {...field} placeholder="e.g., Testnet Launch" /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`milestones.${index}.description`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea {...field} placeholder="Describe what this milestone entails." /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`milestones.${index}.targetDate`}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Target Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={'outline'}
                                        className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                                        >
                                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
                 <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => append({ title: '', description: '', targetDate: new Date() })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Milestone
                </Button>
            </CardContent>
          </Card>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Funding Goal (ETH)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-lg">Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" size="lg" disabled={isLoading} className="w-full">
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Launch Campaign'}
          </Button>
        </div>
        <div className="md:col-span-1">
          <AIAssistant description={descriptionValue} />
        </div>
      </form>
    </Form>
  );
}
