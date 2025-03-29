"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textArea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toastContext";
import { getMenuSettings, updateMenuSettings } from "@/lib/data/menuData";

export default function MenuSettingsManager() {
  const [settings, setSettings] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getMenuSettings();
      setSettings({
        title: data.title,
        description: data.description,
      });
    } catch (error: any) {
      toast({
        title: "خطا در بارگزاری تنظیمات منو!",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateMenuSettings(settings);
      toast({
        title: "تنظیمات منو به‌روزرسانی شد.",
        description: "",
      });
    } catch (error: any) {
      toast({
        title: "خطا در به‌روزرسانی تنظیمات منو!",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              عنوان منو
            </label>
            <Input
              id="title"
              value={settings.title}
              onChange={(e) =>
                setSettings({ ...settings, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              توضیحات منو
            </label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) =>
                setSettings({ ...settings, description: e.target.value })
              }
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="bg-amber-500" disabled={isLoading}>
            {isLoading ? (
              "در حال ذخیره..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                ذخیره‌ی تنظیمات
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
