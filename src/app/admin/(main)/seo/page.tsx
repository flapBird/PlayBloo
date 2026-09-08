"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SeoTaxonomy = {
  id: string;
  name: string;
  meta_title: string | null;
  meta_description: string | null;
};

export default function AdminSEO() {
  const [categories, setCategories] = useState<SeoTaxonomy[]>([]);
  const [series, setSeries] = useState<SeoTaxonomy[]>([]);
  const [activeTab, setActiveTab] = useState("categories");

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      fetch("/api/admin/categories", { cache: "no-store" }).then((response) => response.json()),
      fetch("/api/admin/series", { cache: "no-store" }).then((response) => response.json()),
    ]).then(([categoryData, seriesData]) => {
      if (!cancelled) {
        setCategories(categoryData.data || []);
        setSeries(seriesData.data || []);
      }
    });
    return () => { cancelled = true; };
  }, []);

  async function updateCategory(id: string, field: string, value: string) {
    await fetch("/api/admin/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: value }),
    });
  }

  async function updateSeries(id: string, field: string, value: string) {
    await fetch("/api/admin/series", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: value }),
    });
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">SEO Settings</h1><p className="text-sm text-muted-foreground">Manage meta titles and descriptions for categories and series</p></div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="categories">Categories</TabsTrigger><TabsTrigger value="series">Series</TabsTrigger></TabsList>
        <TabsContent value="categories" className="space-y-4 mt-4">
          {categories.map(cat => (
            <div key={cat.id} className="rounded-xl border bg-card p-4 space-y-3">
              <h3 className="font-semibold">{cat.name}</h3>
              <div className="space-y-2"><Label className="text-xs">Meta Title</Label><Input defaultValue={cat.meta_title || ""} onBlur={e => updateCategory(cat.id, "meta_title", e.target.value)} placeholder={`${cat.name} Games - Play Free Online`} /></div>
              <div className="space-y-2"><Label className="text-xs">Meta Description</Label><Textarea defaultValue={cat.meta_description || ""} onBlur={e => updateCategory(cat.id, "meta_description", e.target.value)} rows={2} placeholder={`Play the best free ${cat.name} games online.`} /></div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="series" className="space-y-4 mt-4">
          {series.map(s => (
            <div key={s.id} className="rounded-xl border bg-card p-4 space-y-3">
              <h3 className="font-semibold">{s.name}</h3>
              <div className="space-y-2"><Label className="text-xs">Meta Title</Label><Input defaultValue={s.meta_title || ""} onBlur={e => updateSeries(s.id, "meta_title", e.target.value)} placeholder={`${s.name} Game Series - Play All Games`} /></div>
              <div className="space-y-2"><Label className="text-xs">Meta Description</Label><Textarea defaultValue={s.meta_description || ""} onBlur={e => updateSeries(s.id, "meta_description", e.target.value)} rows={2} placeholder={`Play the complete ${s.name} game series.`} /></div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
