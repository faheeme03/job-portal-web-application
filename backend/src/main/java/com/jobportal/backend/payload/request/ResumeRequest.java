package com.jobportal.backend.payload.request;

public class ResumeRequest {
    private String name;
    private String email;
    private String phone;
    private String dob;
    private String desiredJobTitle;
    private String summary;
    private String experience;
    private String education;
    private String skills;
    private String projects;
    private String hobbies;

    public ResumeRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getDesiredJobTitle() { return desiredJobTitle; }
    public void setDesiredJobTitle(String desiredJobTitle) { this.desiredJobTitle = desiredJobTitle; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getProjects() { return projects; }
    public void setProjects(String projects) { this.projects = projects; }

    public String getHobbies() { return hobbies; }
    public void setHobbies(String hobbies) { this.hobbies = hobbies; }
}
