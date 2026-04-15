import { SocialMediaReport } from "@/app/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


interface Props {
  data: SocialMediaReport;
  onChange: (data: SocialMediaReport) => void;
}

const SocialMediaFields = ({ data, onChange }: Props) => {
  const update = (field: keyof SocialMediaReport, value: string) => {
    const numFields: (keyof SocialMediaReport)[] = ["totalPost", "totalView", "totalEngagement", "followers"];
    onChange({
      ...data,
      [field]: numFields.includes(field) ? Number(value) || 0 : value,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Social Media Details
      </h3>

      <div className="space-y-3">
        <div>
          <Label htmlFor="mediaName">Media Name</Label>
          <Input id="mediaName" placeholder="e.g. Instagram, TikTok" value={data.mediaName} onChange={(e) => update("mediaName", e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="totalPost">Total Posts</Label>
            <Input id="totalPost" type="number" min={0} value={data.totalPost || ""} onChange={(e) => update("totalPost", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="totalView">Total Views</Label>
            <Input id="totalView" type="number" min={0} value={data.totalView || ""} onChange={(e) => update("totalView", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="totalEngagement">Engagement</Label>
            <Input id="totalEngagement" type="number" min={0} value={data.totalEngagement || ""} onChange={(e) => update("totalEngagement", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="followers">Followers</Label>
            <Input id="followers" type="number" min={0} value={data.followers || ""} onChange={(e) => update("followers", e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaFields;
