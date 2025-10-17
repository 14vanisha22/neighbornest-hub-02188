import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Heart, Users, TrendingUp, Award, MessageSquare, Target, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreatePollDialog } from "./CreatePollDialog";
import { ReportProblemDialog } from "./ReportProblemDialog";

export const SocialGoodSection = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getCurrentUser();
    fetchOrganizations();
    fetchLeaderboard();
    fetchPolls();
    fetchProblems();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchUserVotes();
      fetchUserUpvotes();
    }
  }, [currentUserId]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const fetchOrganizations = async () => {
    const { data } = await supabase
      .from("social_organizations")
      .select("*")
      .limit(6);
    if (data) setOrganizations(data);
  };

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, points")
      .eq("show_on_leaderboard", true)
      .order("points", { ascending: false })
      .limit(10);
    if (data) setLeaderboard(data);
  };

  const fetchPolls = async () => {
    const { data } = await supabase
      .from("polls")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setPolls(data);
  };

  const fetchProblems = async () => {
    const { data, error } = await supabase
      .from("problem_reports")
      .select("*")
      .order("upvotes", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching problems:", error);
      return;
    }

    setProblems(data || []);
  };

  const fetchUserVotes = async () => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from("poll_votes")
      .select("poll_id, option_index")
      .eq("user_id", currentUserId);

    if (error) {
      console.error("Error fetching user votes:", error);
      return;
    }

    const votesMap: Record<string, number> = {};
    data?.forEach((vote) => {
      votesMap[vote.poll_id] = vote.option_index;
    });
    setUserVotes(votesMap);
  };

  const fetchUserUpvotes = async () => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from("problem_upvotes")
      .select("problem_id")
      .eq("user_id", currentUserId);

    if (error) {
      console.error("Error fetching user upvotes:", error);
      return;
    }

    const upvotesSet = new Set(data?.map((upvote) => upvote.problem_id) || []);
    setUserUpvotes(upvotesSet);
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote",
        variant: "destructive",
      });
      return;
    }

    if (userVotes[pollId] !== undefined) {
      toast({
        title: "Already voted",
        description: "You have already voted on this poll",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("poll_votes")
      .insert({
        poll_id: pollId,
        user_id: currentUserId,
        option_index: optionIndex,
      });

    if (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to submit vote",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Vote submitted",
      description: "Thank you for participating!",
    });

    fetchPolls();
    fetchUserVotes();
  };

  const handleUpvote = async (problemId: string) => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upvote",
        variant: "destructive",
      });
      return;
    }

    const hasUpvoted = userUpvotes.has(problemId);

    if (hasUpvoted) {
      const { error } = await supabase
        .from("problem_upvotes")
        .delete()
        .eq("problem_id", problemId)
        .eq("user_id", currentUserId);

      if (error) {
        console.error("Error removing upvote:", error);
        return;
      }
    } else {
      const { error } = await supabase
        .from("problem_upvotes")
        .insert({
          problem_id: problemId,
          user_id: currentUserId,
        });

      if (error) {
        console.error("Error adding upvote:", error);
        return;
      }
    }

    fetchProblems();
    fetchUserUpvotes();
  };

  const getOrgTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      orphanage: Heart,
      "old age home": Users,
      "blood donation": Heart,
      ngo: Target,
    };
    const Icon = icons[type.toLowerCase()] || Heart;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <section id="social-good" className="py-20 px-4 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Social Good Hub
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Make a difference in your community through volunteering, donations, and civic engagement
          </p>
        </div>

        <Tabs defaultValue="organizations" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="polls">Polls</TabsTrigger>
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="projects">Impact Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="organizations" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <Card key={org.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {getOrgTypeIcon(org.type)}
                      <Badge variant="outline">{org.type}</Badge>
                      {org.verified && <Badge>Verified</Badge>}
                    </div>
                    <CardTitle className="text-xl">{org.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground line-clamp-3">{org.description}</p>
                    <p className="text-sm"><strong>Location:</strong> {org.location}</p>
                    {org.contact_phone && (
                      <p className="text-sm"><strong>Contact:</strong> {org.contact_phone}</p>
                    )}
                    <div className="flex gap-2">
                      <Button className="flex-1">Volunteer</Button>
                      {org.donation_link && (
                        <Button variant="outline" className="flex-1">Donate</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-orange-500" : "bg-muted"
                        }`}>
                          <span className="font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{user.display_name || "Anonymous"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="font-bold">{user.points} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="polls" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Community Polls</h3>
              <CreatePollDialog onPollCreated={fetchPolls} />
            </div>
            <div className="grid gap-6">
              {polls.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No active polls</p>
              ) : (
                polls.map((poll) => {
                  const totalVotes = poll.total_votes || 0;
                  const hasVoted = userVotes[poll.id] !== undefined;
                  
                  return (
                    <Card key={poll.id}>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">{poll.title}</h3>
                        {poll.description && (
                          <p className="text-sm text-muted-foreground mb-4">{poll.description}</p>
                        )}
                        <div className="space-y-3">
                          {poll.options.map((option: any, index: number) => {
                            const percentage = totalVotes > 0 
                              ? Math.round((option.votes / totalVotes) * 100) 
                              : 0;
                            const isUserChoice = userVotes[poll.id] === index;

                            return (
                              <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <Button
                                    variant={isUserChoice ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleVote(poll.id, index)}
                                    disabled={hasVoted}
                                    className="flex-1 justify-start"
                                  >
                                    <span className="text-sm">{option.text}</span>
                                  </Button>
                                  <Badge variant="secondary" className="ml-2">
                                    {percentage}%
                                  </Badge>
                                </div>
                                {hasVoted && (
                                  <Progress value={percentage} className="h-2" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {hasVoted && (
                          <p className="text-xs text-muted-foreground mt-4">
                            Total votes: {totalVotes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="surveys">
            <Card>
              <CardHeader>
                <CardTitle>Community Surveys</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Surveys feature coming soon. Help gather community opinions on important issues.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problems" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Community Problems</h3>
              <ReportProblemDialog onProblemReported={fetchProblems} />
            </div>
            <div className="grid gap-6">
              {problems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No problems reported yet</p>
              ) : (
                problems.map((problem) => {
                  const hasUpvoted = userUpvotes.has(problem.id);

                  return (
                    <Card key={problem.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge>{problem.category}</Badge>
                              <Badge variant={problem.status === "reported" ? "destructive" : "secondary"}>
                                {problem.status}
                              </Badge>
                            </div>
                            <h3 className="font-semibold mb-2">{problem.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              📍 {problem.location}
                            </p>
                            <p className="text-sm mb-4">{problem.description}</p>
                            {problem.image_url && (
                              <img
                                src={problem.image_url}
                                alt={problem.title}
                                className="w-full max-w-md rounded-lg mb-4"
                              />
                            )}
                          </div>
                          <Button
                            variant={hasUpvoted ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleUpvote(problem.id)}
                            className="flex-col h-auto py-2"
                          >
                            <ThumbsUp className={`h-4 w-4 ${hasUpvoted ? "fill-current" : ""}`} />
                            <span className="text-xs mt-1">{problem.upvotes}</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Impact Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Join ongoing community improvement projects and make a real impact.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
