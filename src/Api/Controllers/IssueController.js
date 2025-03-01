const issueService = require("../Services/IssueService");

const issuesController = async (req, res) => {
  try {
    const { action, issue_id } = req.params;
    const { status } = req.body;

    const actions = {
      upsert: () => issueService.upsertIssue(req.body),
      get: () => (issue_id ? issueService.getIssueById(issue_id) : issueService.getIssues(req.query)),
      delete: () => issueService.deleteIssueById(issue_id),
      "update-status": () => {
        if (!status) throw new Error("Status is required");
        return issueService.updateIssueStatus(issue_id, status);
      },
    };

    if (!actions[action]) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    const result = await actions[action]();

    if (!res.headersSent) { 
      return res.status(result.success ? 200 : 400).json(result);
    }

  } catch (err) {
    if (!res.headersSent) {  
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = issuesController;
