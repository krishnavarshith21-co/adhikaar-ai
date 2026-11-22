package com.adhikaarai.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "scheme_categories")
public class SchemeCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "label_en", nullable = false, length = 100)
    private String labelEn;

    @Column(name = "label_te", length = 100)
    private String labelTe;

    @Column(length = 50)
    private String icon;

    @Column(columnDefinition = "TEXT")
    private String description;

    public SchemeCategory() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLabelEn() { return labelEn; }
    public void setLabelEn(String labelEn) { this.labelEn = labelEn; }

    public String getLabelTe() { return labelTe; }
    public void setLabelTe(String labelTe) { this.labelTe = labelTe; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

