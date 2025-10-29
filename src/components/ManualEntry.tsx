import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  id: string;
  question: string;
  unit: string;
  placeholder: string;
}

export const ManualEntry = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [meterType, setMeterType] = useState("");
  const [reading, setReading] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    if (meterType) {
      fetchQuestions();
    } else {
      setQuestions([]);
      setAnswers({});
    }
  }, [meterType]);

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-energy-questions', {
        body: { meterType }
      });

      if (error) throw error;
      
      if (data?.questions) {
        setQuestions(data.questions);
        const initialAnswers: Record<string, string> = {};
        data.questions.forEach((q: Question) => {
          initialAnswers[q.id] = "";
        });
        setAnswers(initialAnswers);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error("Failed to load questions. Please try again.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !meterType || !reading) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to submit readings");
        return;
      }

      // Calculate cost (₹12 per kWh)
      const cost = parseFloat(reading) * 12;

      // Insert meter reading
      const { data: meterReading, error: readingError } = await supabase
        .from('meter_readings')
        .insert({
          user_id: user.id,
          reading_date: format(date, 'yyyy-MM-dd'),
          meter_type: meterType,
          reading: parseFloat(reading),
          cost: cost,
        })
        .select()
        .single();

      if (readingError) throw readingError;

      // Insert appliance usage data
      if (meterReading && Object.keys(answers).length > 0) {
        const usageData = Object.entries(answers).map(([questionId, answer]) => {
          const question = questions.find(q => q.id === questionId);
          return {
            reading_id: meterReading.id,
            question_id: questionId,
            question: question?.question || '',
            answer: answer,
            unit: question?.unit || '',
          };
        });

        const { error: usageError } = await supabase
          .from('appliance_usage')
          .insert(usageData);

        if (usageError) throw usageError;
      }

      toast.success("Reading submitted successfully!");
      
      // Reset form
      setReading("");
      setMeterType("");
      setQuestions([]);
      setAnswers({});
    } catch (error) {
      console.error('Error submitting reading:', error);
      toast.error("Failed to submit reading. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl">Log Energy Reading</CardTitle>
          <CardDescription>Enter your meter reading manually</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date">Reading Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(day) => day && setDate(day)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meterType">Meter Type</Label>
              <Select value={meterType} onValueChange={setMeterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reading">Meter Reading</Label>
              <Input
                id="reading"
                type="number"
                step="0.01"
                placeholder="Enter reading (e.g., 12345.67)"
                value={reading}
                onChange={(e) => setReading(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Enter the current reading from your meter
              </p>
            </div>

            {loadingQuestions && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Loading questions...</span>
              </div>
            )}

            {questions.length > 0 && (
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-lg font-semibold">Appliance Usage Details</Label>
                <p className="text-sm text-muted-foreground">
                  Help us calculate your energy usage more accurately
                </p>
                {questions.map((q) => (
                  <div key={q.id} className="space-y-2">
                    <Label htmlFor={q.id}>{q.question}</Label>
                    <Input
                      id={q.id}
                      type="number"
                      step="0.1"
                      placeholder={q.placeholder}
                      value={answers[q.id] || ""}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">{q.unit}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Units</Label>
                <p className="text-2xl font-bold text-foreground">kWh</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Rate</Label>
                <p className="text-2xl font-bold text-foreground">₹12</p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={!reading || !meterType}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Reading
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
