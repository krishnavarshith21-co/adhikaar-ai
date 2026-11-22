package com.adhikaarai.backend.controller;
import com.adhikaarai.backend.entity.CitizenWorkspace;
import com.adhikaarai.backend.repository.CitizenWorkspaceRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.security.Principal;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
@RestController @RequestMapping("/api/v1/workspace")
public class WorkspaceController {
    private final CitizenWorkspaceRepository repo; private final ObjectMapper mapper;
    public WorkspaceController(CitizenWorkspaceRepository repo, ObjectMapper mapper) { this.repo=repo; this.mapper=mapper; }
    private Map<String,Object> view(CitizenWorkspace row) throws Exception {
        Map<String,Object> value=new LinkedHashMap<>(); value.put("revision",row.getRevision()); value.put("workspace", row.getContent()==null ? null : mapper.readTree(row.getContent())); return value;
    }
    @GetMapping public Map<String,Object> get(Principal user) throws Exception { return view(repo.findById(Long.valueOf(user.getName())).orElse(new CitizenWorkspace(Long.valueOf(user.getName())))); }
    @PutMapping @Transactional public Map<String,Object> put(Principal user, @RequestBody JsonNode body) throws Exception {
        var row=repo.findById(Long.valueOf(user.getName())).orElse(new CitizenWorkspace(Long.valueOf(user.getName())));
        if (!body.has("revision") || row.getRevision()!=body.get("revision").asLong()) throw new ResponseStatusException(HttpStatus.CONFLICT);
        var content=body.get("workspace");
        if (content==null || !content.isObject() || !content.has("profile") || content.toString().length()>32768) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        row.setContent(content.toString()); return view(repo.saveAndFlush(row));
    }
}
