import Map "mo:core/Map";
import Time "mo:core/Time";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Random "mo:core/Random";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import InviteLinksModule "invite-links/invite-links-module";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ApplicationStatus = { #pending; #accepted; #rejected };

  public type GuestApplication = {
    id : Text;
    name : Text;
    age : Nat;
    city : Text;
    socialHandle : Text;
    personalityAnswers : Text;
    submissionTimestamp : Time.Time;
    status : ApplicationStatus;
  };

  public type ApplicationInput = {
    name : Text;
    age : Nat;
    city : Text;
    socialHandle : Text;
    personalityAnswers : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let applications = Map.empty<Text, GuestApplication>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let maxCapacity = 40;

  let inviteState = InviteLinksModule.initState();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Application submission - public, no authentication required
  public shared ({ caller }) func submitApplication(input : ApplicationInput) : async Text {
    let id = input.name # "-" # input.socialHandle # "-" # Time.now().toText();
    let application : GuestApplication = {
      id;
      name = input.name;
      age = input.age;
      city = input.city;
      socialHandle = input.socialHandle;
      personalityAnswers = input.personalityAnswers;
      submissionTimestamp = Time.now();
      status = #pending;
    };
    applications.add(id, application);
    id;
  };

  // Admin-only functions
  public query ({ caller }) func getAllApplications() : async [GuestApplication] {
    checkAdmin(caller);
    applications.values().toArray();
  };

  public query ({ caller }) func getApplicationById(id : Text) : async GuestApplication {
    checkAdmin(caller);
    switch (applications.get(id)) {
      case (null) { Runtime.trap("Application not found") };
      case (?application) { application };
    };
  };

  public shared ({ caller }) func updateApplicationStatus(id : Text, status : ApplicationStatus) : async () {
    checkAdmin(caller);

    let acceptedCount = applications.values().filter(
      func(app) { app.status == #accepted }
    ).toArray().size();

    if (status == #accepted and acceptedCount >= maxCapacity) {
      Runtime.trap("Max capacity reached. Cannot accept more applications");
    };

    switch (applications.get(id)) {
      case (null) { Runtime.trap("Application not found") };
      case (?application) {
        let updatedApplication : GuestApplication = {
          application with
          status;
        };
        applications.add(id, updatedApplication);
      };
    };
  };

  func checkAdmin(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  // Invite links and RSVP functions
  public shared ({ caller }) func generateInviteCode() : async Text {
    checkAdmin(caller);
    let blob = await Random.blob();
    let code = InviteLinksModule.generateUUID(blob);
    InviteLinksModule.generateInviteCode(inviteState, code);
    code;
  };

  public shared func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    InviteLinksModule.submitRSVP(inviteState, name, attending, inviteCode);
  };

  public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
    checkAdmin(caller);
    InviteLinksModule.getAllRSVPs(inviteState);
  };

  public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
    checkAdmin(caller);
    InviteLinksModule.getInviteCodes(inviteState);
  };
};
