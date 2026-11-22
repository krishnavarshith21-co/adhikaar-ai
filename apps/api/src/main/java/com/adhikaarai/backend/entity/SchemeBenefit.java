package com.adhikaarai.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "scheme_benefits")
public class SchemeBenefit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @Column(name = "benefit_text", nullable = false, columnDefinition = "TEXT")
    private String benefitText;

    @Column(name = "benefit_text_te", columnDefinition = "TEXT")
    private String benefitTextTe;

    @Column(name = "order_index")
    private Integer orderIndex = 0;

    public SchemeBenefit() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Scheme getScheme() { return scheme; }
    public void setScheme(Scheme scheme) { this.scheme = scheme; }

    public String getBenefitText() { return benefitText; }
    public void setBenefitText(String benefitText) { this.benefitText = benefitText; }

    public String getBenefitTextTe() { return benefitTextTe; }
    public void setBenefitTextTe(String benefitTextTe) { this.benefitTextTe = benefitTextTe; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}

