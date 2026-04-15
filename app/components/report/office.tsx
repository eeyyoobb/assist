import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Plus, Trash2 } from "lucide-react";
import { ConsultingEntry, OfficeActivityReport } from "@/app/types";

interface Props {
  data: OfficeActivityReport;
  onChange: (data: OfficeActivityReport) => void;
}

const OfficeActivityFields = ({ data, onChange }: Props) => {
  const addConsulting = () => {
    onChange({
      ...data,
      consulting: [...data.consulting, { name: "", phoneNumber: "" }],
    });
  };

  const removeConsulting = (index: number) => {
    onChange({
      ...data,
      consulting: data.consulting.filter((_, i) => i !== index),
    });
  };

  const updateConsulting = (index: number, field: keyof ConsultingEntry, value: string) => {
    const updated = [...data.consulting];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, consulting: updated });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Office Activity Details
      </h3>

      <div>
        <Label>Task Type</Label>
        <Select value={data.task} onValueChange={(v) => onChange({ ...data, task: v as "equb" | "key" })}>
          <SelectTrigger>
            <SelectValue placeholder="Select task" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equb">Equb</SelectItem>
            <SelectItem value="key">Key</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Consulting Entries</Label>
          <Button type="button" variant="outline" size="sm" onClick={addConsulting} className="gap-1">
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>

        {data.consulting.length === 0 && (
          <p className="text-sm text-muted-foreground py-3 text-center border border-dashed rounded-lg">
            No consulting entries yet
          </p>
        )}

        {data.consulting.map((entry, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label className="text-xs">Name</Label>
              <Input placeholder="Full name" value={entry.name} onChange={(e) => updateConsulting(i, "name", e.target.value)} />
            </div>
            <div className="flex-1">
              <Label className="text-xs">Phone</Label>
              <Input placeholder="+251..." value={entry.phoneNumber} onChange={(e) => updateConsulting(i, "phoneNumber", e.target.value)} />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeConsulting(i)} className="text-destructive shrink-0 mb-0.5">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficeActivityFields;
