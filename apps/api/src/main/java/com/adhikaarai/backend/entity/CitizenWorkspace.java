package com.adhikaarai.backend.entity;
import jakarta.persistence.*;
@Entity @Table(name="citizen_workspaces")
public class CitizenWorkspace {
    @Id private Long userId;
    @Column(columnDefinition="text") private String content;
    @Version private long revision;
    public CitizenWorkspace() {}
    public CitizenWorkspace(Long id) { userId=id; }
    public Long getUserId() { return userId; }
    public String getContent() { return content; }
    public void setContent(String value) { content=value; }
    public long getRevision() { return revision; }
}
