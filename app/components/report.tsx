"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";
import {
  OfficeActivityReport,
  ReportFormData,
  SocialMediaReport,
} from "../types";
import SocialMediaFields from "./report/media";
import OfficeActivityFields from "./report/office";
import { User } from "../page";

const defaultSocialMedia: SocialMediaReport = {
  mediaName: "",
  totalPost: 0,
  totalView: 0,
  totalEngagement: 0,
  followers: 0,
};

const defaultOfficeActivity: OfficeActivityReport = {
  task: "equb",
  consulting: [],
};

const ReportPage = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ReportFormData>({
    company: "",
    staffRole: "media_manager",
    reportType: "social_media",
    socialMedia: { ...defaultSocialMedia },
    officeActivity: { ...defaultOfficeActivity },
  });

  const handleReportTypeChange = (value: string) => {
    const reportType = value as ReportFormData["reportType"];
    setForm((prev) => ({
      ...prev,
      reportType,
      staffRole: reportType === "social_media" ? "media_manager" : "sales",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.company.trim()) {
      toast.error("Please enter the company name");
      return;
    }

    if (
      form.reportType === "social_media" &&
      !form.socialMedia?.mediaName.trim()
    ) {
      toast.error("Please enter the media name");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          userId: user.id, // replace with auth user later
          userName: user.first_name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit report");
      }

      toast.success("Report submitted successfully!");

      setForm({
        company: "",
        staffRole: "media_manager",
        reportType: "social_media",
        socialMedia: { ...defaultSocialMedia },
        officeActivity: { ...defaultOfficeActivity },
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit report",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Daily Report</h1>
          <p className="text-xs text-muted-foreground">
            Submit your activity report -{user.first_name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Company name"
                value={form.company}
                onChange={(e) =>
                  setForm((p) => ({ ...p, company: e.target.value }))
                }
              />
            </div>

            <div>
              <Label>Report Type</Label>
              <Select
                value={form.reportType}
                onValueChange={handleReportTypeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="office_activity">
                    Office Activity
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Staff Role</Label>
              <Input
                readOnly
                value={
                  form.staffRole === "media_manager" ? "Media Manager" : "Sales"
                }
                className="bg-muted cursor-not-allowed"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            {form.reportType === "social_media" ? (
              <SocialMediaFields
                data={form.socialMedia || defaultSocialMedia}
                onChange={(socialMedia) =>
                  setForm((p) => ({ ...p, socialMedia }))
                }
              />
            ) : (
              <OfficeActivityFields
                data={form.officeActivity || defaultOfficeActivity}
                onChange={(officeActivity) =>
                  setForm((p) => ({ ...p, officeActivity }))
                }
              />
            )}
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Submit Report"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ReportPage;
