"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input as ShadInput } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FileUploadButton from "@/components/FileUploadButton";
import Image from "next/image";
import {
  CircleX,
  Edit3,
  Save,
  X,
  User,
  Mail,
  Briefcase,
  Globe,
  Linkedin,
  Twitter,
  Languages,
  Award,
  Camera,
  Loader,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  useGetInstructor,
  useUpdateInstructor,
} from "../_hooks/instructor-hooks";
import type { z } from "zod";
import { instructorSchema } from "@/types/types";

type InstructorFormValues = z.infer<typeof instructorSchema>;

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.FC<any>;
}

export const Input: React.FC<CustomInputProps> = ({
  label,
  icon: Icon,
  ...props
}) => (
  <div>
    {label && <label className="block text-sm font-medium">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-2 top-1/2 -translate-y-1/2" />}
      <ShadInput {...props} />
    </div>
  </div>
);

export default function InstructorEditProfile() {
  const { data: instructor, isLoading } = useGetInstructor();
  const { mutate: updateInstructor, isPending: updating } =
    useUpdateInstructor();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("");

  const skillColors = [
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-green-100 text-green-800 border-green-200",
    "bg-purple-100 text-purple-800 border-purple-200",
    "bg-orange-100 text-orange-800 border-orange-200",
    "bg-pink-100 text-pink-800 border-pink-200",
    "bg-indigo-100 text-indigo-800 border-indigo-200",
    "bg-teal-100 text-teal-800 border-teal-200",
    "bg-red-100 text-red-800 border-red-200",
  ];

  const languageColors = [
    "bg-emerald-100 text-emerald-800 border-emerald-200",
    "bg-cyan-100 text-cyan-800 border-cyan-200",
    "bg-amber-100 text-amber-800 border-amber-200",
    "bg-rose-100 text-rose-800 border-rose-200",
    "bg-violet-100 text-violet-800 border-violet-200",
    "bg-lime-100 text-lime-800 border-lime-200",
  ];

  const form = useForm<InstructorFormValues>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      title: "",
      socialLinks: { website: "", linkedin: "", twitter: "" },
      skills: [],
      languages: [],
      avatar: "",
    },
  });

  const languages = form?.getValues("languages") ?? [];
  const skills = form?.getValues("skills") ?? [];

  useEffect(() => {
    if (instructor) {
      form.reset({
        name: instructor.name || "",
        email: instructor.email || "",
        bio: instructor.bio || "",
        title: instructor.title || "",
        socialLinks: instructor.socialLinks || {
          website: "",
          linkedin: "",
          twitter: "",
        },
        skills: instructor.skills || [],
        languages: instructor.languages || [],
        avatar: instructor.avatar || "",
      });
    }
  }, [instructor, form]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (data: InstructorFormValues) => {
    updateInstructor(data, {
      onSuccess: () => {
        toast({ title: "Profile updated successfully", variant: "default" });
        setEditMode(false);
      },
      onError: (err: any) => {
        toast({
          title: "Error updating profile",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;

    const currentSkills = form!.getValues("skills")!;
    if (!currentSkills.includes(trimmed)) {
      form!.setValue("skills", [...currentSkills, trimmed]);
    }

    setCurrentSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues("skills");
    form.setValue(
      "skills",
      currentSkills?.filter((skill) => skill !== skillToRemove)
    );
  };

  const addLanguage = (language: string) => {
    const trimmed = language.trim();
    if (!trimmed) return;

    const currentLanguages = form?.getValues("languages") ?? [];
    if (!currentLanguages.includes(trimmed)) {
      form?.setValue("languages", [...currentLanguages, trimmed]);
    }

    setCurrentLanguage("");
  };

  const removeLanguage = (languageToRemove: string) => {
    const currentLanguages = form?.getValues("languages") ?? [];
    form?.setValue(
      "languages",
      currentLanguages.filter((language) => language !== languageToRemove)
    );
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === " " && currentSkill.trim()) {
      e.preventDefault();
      addSkill(currentSkill);
    }
  };

  const handleLanguageKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === " " && currentLanguage.trim()) {
      e.preventDefault();
      addLanguage(currentLanguage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Instructor Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your teaching profile and information
          </p>
        </div>
        <Button
          onClick={() => setEditMode(!editMode)}
          variant={editMode ? "outline" : "secondary"}
          className="gap-2"
        >
          {editMode ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {!editMode ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Overview Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="relative">
                  {form.getValues("avatar") ? (
                    <div className="w-24 h-24 relative rounded-full overflow-hidden border-4 border-border">
                      <Image
                        src={form.getValues("avatar") || "/placeholder.svg"}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-border">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      {form.getValues("name") || "No name provided"}
                    </h2>
                    <p className="text-muted-foreground">
                      {form.getValues("title") || "No title provided"}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {form.getValues("bio") || "No bio provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-card-foreground">
                  {form.getValues("email") || "No email provided"}
                </span>
              </div>
              {form.getValues("socialLinks.website") && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={form.getValues("socialLinks.website")}
                    className=" hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {form.getValues("socialLinks.website")}
                  </a>
                </div>
              )}
              {form.getValues("socialLinks.linkedin") && (
                <div className="flex items-center gap-3">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={form.getValues("socialLinks.linkedin")}
                    className=" hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {form.getValues("socialLinks.twitter") && (
                <div className="flex items-center gap-3">
                  <Twitter className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={form.getValues("socialLinks.twitter")}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter Profile
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills & Languages Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Skills & Languages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">
                      No skills added
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Languages
                </h4>
                <div className="flex flex-wrap gap-2">
                  {languages.length > 0 ? (
                    languages.map((language, index) => (
                      <Badge key={index} variant="outline">
                        {language}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">
                      No languages added
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-8"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              {/* Avatar Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Profile Picture
                </h3>
                <div className="flex items-center gap-6">
                  {form.getValues("avatar") ? (
                    <div className="relative">
                      <div className="w-24 h-24 relative rounded-full overflow-hidden border-4 border-border">
                        <Image
                          src={form.getValues("avatar") || "/placeholder.svg"}
                          alt="Avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
                        onClick={() => form.setValue("avatar", "")}
                      >
                        <CircleX className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-border">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <FileUploadButton
                    onClientUploadComplete={(res) =>
                      form.setValue("avatar", res[0].url)
                    }
                    onUploadError={(error: Error) =>
                      toast({
                        title: "Upload Error",
                        description: error.message,
                        variant: "destructive",
                      })
                    }
                    buttonText="Upload Avatar"
                  />
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Full Name"
                    icon={User}
                    {...form.register("name")}
                  />
                  <Input
                    label="Email Address"
                    icon={Mail}
                    {...form.register("email")}
                  />
                </div>
                <Input
                  label="Professional Title"
                  icon={Briefcase}
                  {...form.register("title")}
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bio
                  </label>
                  <Textarea
                    {...form.register("bio")}
                    rows={4}
                    className="resize-none"
                    placeholder="Tell us about yourself and your teaching experience..."
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Social Links
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Website"
                    icon={Globe}
                    placeholder="https://yourwebsite.com"
                    {...form.register("socialLinks.website")}
                  />
                  <Input
                    label="LinkedIn"
                    icon={Linkedin}
                    placeholder="https://linkedin.com/in/yourprofile"
                    {...form.register("socialLinks.linkedin")}
                  />
                </div>
                <Input
                  label="Twitter"
                  icon={Twitter}
                  placeholder="https://twitter.com/yourhandle"
                  {...form.register("socialLinks.twitter")}
                />
              </div>

              {/* Skills and Languages */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Skills & Languages
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Skills
                    </label>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2 min-h-[2rem]">
                        {(form.watch("skills") || []).map((skill, index) => (
                          <div
                            key={skill}
                            className={`relative inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                              skillColors[index % skillColors.length]
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                            {skill}
                          </div>
                        ))}
                      </div>

                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          onKeyDown={handleSkillKeyPress}
                          placeholder="Type a skill and press space to add..."
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Press space to add each skill
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Languages
                    </label>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2 min-h-[2rem]">
                        {(form.watch("languages") || []).map(
                          (language, index) => (
                            <div
                              key={language}
                              className={`relative inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                                languageColors[index % languageColors.length]
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => removeLanguage(language)}
                                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                              >
                                ×
                              </button>
                              {language}
                            </div>
                          )
                        )}
                      </div>

                      <div className="relative">
                        <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={currentLanguage}
                          onChange={(e) => setCurrentLanguage(e.target.value)}
                          onKeyDown={handleLanguageKeyPress}
                          placeholder="Type a language and press space to add..."
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Press space to add each language
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-border">
                <Button
                  type="submit"
                  disabled={updating}
                  className="gap-2 px-8"
                >
                  {updating ? (
                    <>
                      <Save className="h-4 w-4" />
                      Saving <Loader className="animate-spin ml-2" />
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
