package com.adhikaarai.backend;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest(properties={"spring.datasource.url=jdbc:h2:mem:qa;MODE=PostgreSQL;DB_CLOSE_DELAY=-1","spring.datasource.driver-class-name=org.h2.Driver","spring.datasource.username=sa","spring.datasource.password=","spring.jpa.hibernate.ddl-auto=create-drop","spring.flyway.enabled=false"})
@AutoConfigureMockMvc
class AdhikaarBackendApplicationTests {
 @Autowired MockMvc mvc; @Autowired ObjectMapper mapper;
 private String register(String name) throws Exception {
  String result=mvc.perform(post("/api/v1/auth/register").contentType(MediaType.APPLICATION_JSON).content("{\"email\":\""+name+"@example.invalid\",\"password\":\"TestingPassword123!\",\"fullName\":\""+name+"\"}")).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  return mapper.readTree(result).get("token").asText();
 }
 @Test void accountsPersistSeparatelyRejectStaleUpdatesAndInvalidateLogout() throws Exception {
  String a=register("alice"), b=register("bob");
  mvc.perform(get("/api/v1/workspace")).andExpect(status().isUnauthorized());
  mvc.perform(get("/api/v1/workspace").header("Authorization","Bearer forged")).andExpect(status().isUnauthorized());
  String state="{\"revision\":0,\"workspace\":{\"profile\":{\"name\":\"Alice changed\"},\"savedSchemeIds\":[\"pm-vidyalaxmi\"]}}";
  mvc.perform(put("/api/v1/workspace").header("Authorization","Bearer "+a).contentType(MediaType.APPLICATION_JSON).content(state)).andExpect(status().isOk()).andExpect(jsonPath("$.revision").value(1));
  mvc.perform(get("/api/v1/workspace").header("Authorization","Bearer "+a)).andExpect(status().isOk()).andExpect(jsonPath("$.workspace.profile.name").value("Alice changed"));
  mvc.perform(get("/api/v1/workspace").header("Authorization","Bearer "+b)).andExpect(status().isOk()).andExpect(jsonPath("$.workspace").isEmpty());
  mvc.perform(put("/api/v1/workspace").header("Authorization","Bearer "+a).contentType(MediaType.APPLICATION_JSON).content(state)).andExpect(status().isConflict());
  mvc.perform(get("/api/v1/preflight/user/1/readiness").header("Authorization","Bearer "+b)).andExpect(status().isForbidden());
  mvc.perform(post("/api/v1/auth/logout").header("Authorization","Bearer "+a)).andExpect(status().isOk());
  mvc.perform(get("/api/v1/auth/me").header("Authorization","Bearer "+a)).andExpect(status().isUnauthorized());
  mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"alice@example.invalid\",\"password\":\"incorrectPassword\"}")).andExpect(status().isBadRequest());
  String login=mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"alice@example.invalid\",\"password\":\"TestingPassword123!\"}")).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  String fresh=mapper.readTree(login).get("token").asText(); assertNotEquals(a,fresh);
  mvc.perform(get("/api/v1/workspace").header("Authorization","Bearer "+fresh)).andExpect(jsonPath("$.workspace.profile.name").value("Alice changed"));
 }
 @Test void legacyDemoAndAssistantCannotBeUsedWithoutSession() throws Exception {
  mvc.perform(post("/api/v1/auth/demo").contentType(MediaType.APPLICATION_JSON).content("{}")).andExpect(status().isUnauthorized());
  mvc.perform(post("/api/v1/assistant/chat").contentType(MediaType.APPLICATION_JSON).content("{\"message\":\"approve me\"}")).andExpect(status().isUnauthorized());
 }

 @Test void registrationValidatesNameAndBcryptByteLength() throws Exception {
  for (String name : new String[]{"", "   "}) {
   mvc.perform(post("/api/v1/auth/register").contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(java.util.Map.of("email","invalid-name@example.invalid","password","TestingPassword123!","fullName",name)))).andExpect(status().isBadRequest());
  }
  mvc.perform(post("/api/v1/auth/register").contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(java.util.Map.of("email","unicode-password@example.invalid","password","अ".repeat(30),"fullName","Citizen")))).andExpect(status().isBadRequest());
 }
 @Test void emailCaseIsNormalizedForLoginAndDuplicates() throws Exception {
  register("mixedcase");
  mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"MIXEDCASE@example.invalid\",\"password\":\"TestingPassword123!\"}")).andExpect(status().isOk());
  mvc.perform(post("/api/v1/auth/register").contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"MixedCase@example.invalid\",\"password\":\"TestingPassword123!\",\"fullName\":\"Duplicate\"}")).andExpect(status().isBadRequest());
 }
}
