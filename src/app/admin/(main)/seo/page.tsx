"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminSEO() {
  const [categories, setCategories] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("categories");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const supabase = createClient();
    const [catRes, seriesRes] = await Promise.all([
      supabase.from("categories").select("*").order("name", { ascending: true }),
      supabase.from("series").select("*").order("name", { ascending: true }),
    ]);
    setCategories(catRes.data || []); setSeries(seriesRes.data || []);
  }

  async function updateCategory(id: string, field: string, value: string) {
    const supabase = createClient();
    await supabase.from("categories").update({ [field]: value }).eq("id", id);
  }

  async function updateSeries(id: string, field: string, value: string) {
    const supabase = createClient();
    await supabase.from("series").update({ [field]: value }).eq("id", id);
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
