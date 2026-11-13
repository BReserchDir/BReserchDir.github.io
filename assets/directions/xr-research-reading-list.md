# XR character direction — reading list and figure notes

This bibliography covers the sources used in the three final plots, earlier versions, and the related work discussed in this chat and the available portion of *Find Relevant Papers*. Sources already listed are cross-referenced to avoid duplicate entries.

## Papers in the final plot

| Paper | Venue | What the plot uses |
|---|---|---|
| [ARDY: Autoregressive Diffusion with Hybrid Representation for Interactive Human Motion Generation](https://research.nvidia.com/labs/sil/projects/ardy/) | ACM TOG / SIGGRAPH 2026 | Floor-plane root waypoints with configurable frame offsets and interpolation. [Demo controls](https://github.com/nv-tlabs/ardy/blob/main/README.md) |
| [CLoSD: Closing the Loop between Simulation and Diffusion for Multi-task Character Control](https://arxiv.org/html/2410.03441v1) | ICLR 2025 | Strike a supplied target. Detect that the character has sat, then switch to standing through a state machine. |
| [CoMo: Controllable Motion Generation](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/04203.pdf) | ECCV 2024 | Deepen a knee bend in a source clip. Add a hand raise at the end of a run. |
| [DartControl: A Diffusion-Based Autoregressive Motion Model for Real-Time Text-Driven Motion Control](https://zkf1997.github.io/DART/) | ICLR 2025 | Automatically advance to the next waypoint on arrival. Reports 240 frames/s for the text-conditioned waypoint controller. |
| [FineMotion: A Dataset and Benchmark with both Spatial and Temporal Annotation for Fine-grained Motion Generation and Editing](https://openaccess.thecvf.com/content/ICCV2025/html/Wu_FineMotion_A_Dataset_and_Benchmark_with_both_Spatial_and_Temporal_ICCV_2025_paper.html) | ICCV 2025 | Extend the stand after a jumping jack by one second. |
| [Generating Human Motion in 3D Scenes from Text Descriptions](https://openaccess.thecvf.com/content/CVPR2024/html/Cen_Generating_Human_Motion_in_3D_Scenes_from_Text_Descriptions_CVPR_2024_paper.html) | CVPR 2024 | Ground a description such as the table near the sofa in a scanned scene and generate a walk to it. |
| [Generating Physically Realistic and Directable Human Motions from Multi-Modal Inputs](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/07885.pdf) | ECCV 2024 | Reconstruct motion from a headset and controllers. A separate demo uses joystick velocity and heading. |
| [Head-EyeK: Head-eye Coordination and Control Learned in Virtual Reality](https://evansamaa.github.io/files/head-eyek-paper.pdf) | IEEE TVCG 2025 | Coordinate eye and head rotations from fixation targets and start times. The shown animation uses the offline formulation. The paper also evaluates a windowed variant. |
| [Iterative Motion Editing with Natural Language](https://purvigoel.github.io/iterative-motion-editing/) | SIGGRAPH 2024 | Raise a side kick, make it faster, and add a hands-up guard after the kick. Each edit has its own coordinate. |
| [MaskedMimic: Unified Physics-Based Character Control Through Masked Motion Inpainting](https://xbpeng.github.io/projects/MaskedMimic/MaskedMimic_2024.pdf) | ACM TOG 2024 | Reach a supplied 3D hand target within two seconds. In a separate controller, switch from approaching a chair to sitting when in range. |
| [MotionFix: Text-Driven 3D Human Motion Editing](https://motionfix.is.tue.mpg.de/) | SIGGRAPH Asia 2024 | Lower a raised hand in an existing clip. |
| [Move as You Say, Interact as You Can: Language-guided Human Motion Generation with Scene Affordance](https://openaccess.thecvf.com/content/CVPR2024/papers/Wang_Move_as_You_Say_Interact_as_You_Can_Language-guided_Human_CVPR_2024_paper.pdf) | CVPR 2024 | Walk to a described door or chair. Also generate a walk forward followed by a walk back. |
| [Multi-Track Timeline Control for Text-Driven 3D Human Motion Generation](https://mathis.petrovich.fr/stmc/) | CVPR Workshop 2024 | Specify overlapping time intervals for actions, such as keeping the arms raised across a walk-to-jump transition. |
| [OmniControl: Control Any Joint at Any Time for Human Motion Generation](https://proceedings.iclr.cc/paper_files/paper/2024/file/7827290f07f63485b849b66cfa3e5dd0-Paper-Conference.pdf) | ICLR 2024 | Constrain wrist positions at selected frames or guide the pelvis along a supplied path. |
| [QuestEnvSim: Environment-Aware Simulated Motion Tracking from Sparse Sensors](https://arxiv.org/html/2306.05666) | SIGGRAPH 2023 | Track headset and controller poses for live sitting and standing in simulation. |
| [S³: Speech, Script and Scene Driven Head and Eye Animation](https://www.dgp.toronto.edu/projects/s3-conversational-gaze/) | SIGGRAPH 2024 | Tag a known windshield object or tag an upward aversion in an audio-aligned transcript. The output animates the eyes and head. |
| [SimMotionEdit: Text-Based Human Motion Editing with Motion Similarity Prediction](https://lzhyu.github.io/SimMotionEdit.github.io/) | CVPR 2025 | Speed up an action in a source clip. |
| [Synthesizing Physical Character-Scene Interactions](https://arxiv.org/abs/2302.00883) | SIGGRAPH 2023 | Supply a target object bounding box for simulated sitting, lying down, or box carrying. |

## Six additional papers in the earlier performance-revision plot

| Paper | Venue | Example discussed |
|---|---|---|
| [Generating Human Interaction Motions in Scenes with Text Control](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/00549.pdf) | ECCV 2024 | TeSMo generates sitting from a goal pelvis pose and chair geometry, and walks to a supplied floor goal around obstacles. |
| [Autonomous Character-Scene Interaction Synthesis from Text Instruction](https://yzhu.io/publication/hoi2024siggraphasia/paper.pdf) | SIGGRAPH Asia 2024 | LINGO generates multi-stage interactions from text, scene geometry and 3D goals, such as picking up an apple, sitting and eating it. |
| [Reactive Gaze during Locomotion in Natural Environments](https://doi.org/10.1111/cgf.15168) | SCA / Computer Graphics Forum 2024 | Layer eye and head motion onto walking while the body motion stays intact. Salience and terrain determine attention targets. |
| [Real-Time Conversational Gaze Synthesis for Avatars](https://www.uni-bamberg.de/fileadmin/cg/publications/canales23/Canales23_Gaze.pdf) | ACM MIG 2023 | Predict avatar eye rotations from speech and head motion, with a live Quest 2 setup. |
| [Toward User-Aware Interactive Virtual Agents: Generative Multi-Modal Agent Behaviors in VR](https://ieeexplore.ieee.org/abstract/document/10765477) | IEEE ISMAR 2024 | Generate reactive eye contact and head and upper-body behavior from tracked VR user motion. |
| [SARAH: Spatially Aware Real-time Agentic Humans](https://arxiv.org/abs/2602.18432) | 2026 preprint / SIGGRAPH Asia 2026 scheduled | Adjust head-facing alignment toward a tracked conversational partner. [Conference listing](https://sa2026.conference-schedule.org/presentation/?id=papers_1105&sess=sess139) |

## Additional sources used in the final actor-interaction plot

- **InterGen: Diffusion-Based Multi-Human Motion Generation under Complex Interactions** (IJCV, online 2024). Text-conditioned two-character bowing, embracing, and synchronized jumping. [Paper and demos](https://tr3e.github.io/intergen-page/)
- **Simulation and Retargeting of Complex Multi-Character Interactions** (SIGGRAPH 2023). Physics-based retargeting of salsa dancing and other paired performances. [Paper](https://arxiv.org/abs/2305.20041)
- **InterControl: Zero-shot Human Interaction Generation by Controlling Every Joint** (NeurIPS 2024). Joint-pair constraints support intermittent hand contact during dancing. [Paper](https://proceedings.neurips.cc/paper_files/paper/2024/file/be41269a9fe258f1ecba663b0b402322-Paper-Conference.pdf)
- **MoLaM: A Unified Framework for Motion Reasoning and Generation in Human Interaction** (ICCV 2025). Generates one character’s reaction from another character’s supplied motion clip. [Paper and demos](https://molam-motion-language.github.io/)
- **Move-in-2D: 2D-Conditioned Human Motion Generation** (CVPR 2025). Generates the actor’s movement in dog-petting and horse-riding scenes. [Paper](https://openaccess.thecvf.com/content/CVPR2025/papers/Huang_Move-in-2D_2D-Conditioned_Human_Motion_Generation_CVPR_2025_paper.pdf)
- **CG-HOI: Contact-Guided 3D Human-Object Interaction Generation** (CVPR 2024). Generates carrying motion from a supplied box trajectory. [Paper](https://openaccess.thecvf.com/content/CVPR2024/papers/Diller_CG-HOI_Contact-Guided_3D_Human-Object_Interaction_Generation_CVPR_2024_paper.pdf)
- **CHOIS: Controllable Human-Object Interaction Synthesis** (ECCV 2024). Generates the actor and prop motion together for lifting, carrying, and setting down a box. [Paper](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/05720.pdf)

The interaction plot also uses *Generating Human Motion in 3D Scenes from Text Descriptions*, *Synthesizing Physical Character-Scene Interactions*, *CLoSD*, and *MaskedMimic*, listed under Plot 1.

## Sources used in the final equipment plot

- **Augmented Reality for Lighting Adjustment in a Virtual Studio** (IntechOpen book chapter, 2025). AR proxies control physical fixtures via DMX. [Chapter](https://www.intechopen.com/chapters/1219066)
- **Synchronized Lighting Between Real and Virtual Spaces: Spatial Tracking and Pixel Mapping for Dynamic Lighting Control** (Drexel University master’s thesis, 2025). Unreal Engine pixel mapping drives physical lights over wireless DMX. [Thesis](https://doi.org/10.17918/00011163)
- **Designing Oscar: Bespoke Tablet Workflows in ILM StageCraft** (SIGGRAPH Talk 2025). Tablet controls reposition Lightcards on a physical LED wall. [Talk](https://doi.org/10.1145/3721239.3734075)
- **Relightable Gaussian Splatting for Virtual Production Using Image-Based Illumination** (arXiv preprint, 2026). Relights captured scenes digitally and reports rendering throughput. [Paper](https://arxiv.org/html/2605.09024)
- **ChatCam: Empowering Camera Control through Conversational AI** (NeurIPS 2024). Generates virtual camera composition and moves from natural language. [Paper](https://proceedings.neurips.cc/paper_files/paper/2024/file/61dad41cb106aef1154a82965f42df0e-Paper-Conference.pdf)
- **GEN3C: 3D-Informed World-Consistent Video Generation with Precise Camera Control** (CVPR 2025). Rerenders a source video along a supplied camera path. [Paper](https://openaccess.thecvf.com/content/CVPR2025/papers/Ren_GEN3C_3D-Informed_World-Consistent_Video_Generation_with_Precise_Camera_Control_CVPR_2025_paper.pdf)
- **TKCAM: Text and Keyframe to Camera Trajectory Generation** (NeurIPS 2026 acceptance reported in arXiv v2). Generates a camera trajectory from text and RGB keyframes at selected times. [Paper](https://arxiv.org/abs/2610.11105)
- **Exploring the Use of Collaborative Robots in Cinematography** (CHI Extended Abstracts 2023). The Periscope prototype uses image-plane controls and hand tracking to steer a physical camera arm. [Paper](https://graphics.cs.wisc.edu/Papers/2023/PCGM23/pcgm.pdf)
- **CineMPC: A Fully Autonomous Drone Cinematography System Incorporating Zoom, Focus, Pose, and Scene Composition** (IEEE Transactions on Robotics, 2024). Demonstrates a dolly zoom in simulation and motorized focus and zoom on real hardware. [Paper](https://arxiv.org/html/2401.05272)
- **IRIS: Learning-Driven Task-Specific Cinema Robot Arm for Visuomotor Motion Control** (CRV 2026). Uses a goal image and feedback to execute a physical dolly-in toward a cup and navigate around an obstacle. [Paper](https://arxiv.org/html/2602.17537)

## Other papers discussed or considered

### From the referenced conversation and proposal

- **GenZI**, *Zero-Shot 3D Human-Scene Interaction Generation* (CVPR 2024). Synthesizes a 3D interaction pose from text and a coarse 3D interaction location. [Paper](https://arxiv.org/abs/2311.17737)
- **MotionLab**, *Unified Human Motion Generation and Editing via the Motion-Condition-Motion Paradigm* (ICCV 2025). Organizes editing tasks around source motion, condition and target motion. [Paper](https://arxiv.org/abs/2502.02358)
- **Reality Proxy**, *Fluid Interactions with Real-World Objects in MR via Abstract Representations* (UIST 2025). Relevant to MR target selection and proxy interaction. [Paper](https://doi.org/10.1145/3746059.3747709)
- **Interactive Design of Stylized Walking Gaits for Robotic Characters** (ACM TOG 2024). Relevant to specifying gait style for physical execution. [Paper](https://doi.org/10.1145/3658227)
- **Design and Control of a Bipedal Robotic Character** (RSS 2024). Physical character control context. [Paper](https://doi.org/10.15607/RSS.2024.XX.103)
- **Walk Like This**, *Stylized Locomotion for Physics-Based Characters through Example-Driven Diffusion* (2026 preprint). Connects style examples to physically simulated locomotion. [Paper](https://arxiv.org/abs/2610.18147)

### Considered during the literature search

- **T2LM**, *Long-Term 3D Human Motion Generation from Multiple Sentences* (CVPR Workshop 2024). [Paper](https://openaccess.thecvf.com/content/CVPR2024W/HuMoGen/html/Lee_T2LM_Long-Term_3D_Human_Motion_Generation_from_Multiple_Sentences_CVPRW_2024_paper.html)
- **Story-to-Motion**, *Synthesizing Infinite and Controllable Character Animation from Long Text* (SIGGRAPH Asia Technical Communications 2023). [Paper](https://arxiv.org/abs/2311.07446)
- **RSMT**, *Real-time Stylized Motion Transition for Characters* (SIGGRAPH 2023). [Paper](https://yuyujunjun.github.io/files/2023_Siggraph_RSMT.pdf)
- **VAGENT**, *A Vision-Language Embodied Agent for Attention Awareness and Guidance in Virtual Reality* (ISMAR 2026). [Program abstract](https://www.ieeeismar.net/2026/papers/)
- **SIAgent**, *Spatial Interaction Agent via LLM-Powered Eye-Hand Motion Intent Understanding in VR* (IEEE TVCG 2026). [Paper](https://doi.org/10.1109/TVCG.2026.3686395)
- **Real-Time Multi-Map Saliency-Driven Gaze Behavior for Non-Conversational Characters** (IEEE TVCG 2024). [Paper](https://doi.org/10.1109/TVCG.2023.3244679)
- **GazeGaussian**, *High-Fidelity Gaze Redirection with 3D Gaussian Splatting* (ICCV 2025). [Paper](https://www.openaccess.thecvf.com/content/ICCV2025/papers/Wei_GazeGaussian_High-Fidelity_Gaze_Redirection_with_3D_Gaussian_Splatting_ICCV_2025_paper.pdf)
- **CARING-AI**, *Towards Authoring Context-aware Augmented Reality INstruction through Generative Artificial Intelligence* (CHI 2025). [Paper](https://doi.org/10.1145/3706598.3713348)

### Removed during the relevance and date review

- **InterPet4D: A Multimodal 4D Human-Pet Interaction Dataset for Pet Motion Generation** (ECCV 2026). An earlier interaction plot used its recorded human–dog interactions and dog motion generated from recorded trainer cues. [Paper](https://arxiv.org/html/2607.10287) · [Venue confirmation](https://admissions.isct.ac.jp/en/news/7st52cncromz)
- **AR Fitness Dog: Effects of a User-Mimicking Interactive Virtual Pet on User Experience and Social Presence in Physical Exercise** (IEEE TVCG 2025). An earlier plot used the live AR dog’s mimicry of the participant. [Paper](https://doi.org/10.1109/TVCG.2025.3549858)
- **User-Aware VR Agents** also appeared in the earlier actor-interaction plot. Its entry above is retained for the performance-revision plot.

- **DirActor**, *Creating Interaction Illustrations by Oneself through Directing and Acting Simultaneously in VR* (CHI Extended Abstracts 2024). Its relevant demos create, select and edit still poses for illustrations. [Paper](https://sketch.kaist.ac.kr/pdf/publications/2024_chi_diractor.pdf)
- **Oastaad**, *How People Prompt Generative AI to Create Interactive VR Scenes* (DIS 2024). Its plotted examples were scene-scripting interactions. [Paper](https://ricelab.github.io/papers/manesh2024prompting/)
- **SmartBody: Behavior Realization for Embodied Conversational Agents** (AAMAS 2008) and **Real-Time Expressive Gaze Animation for Virtual Humans** (AAMAS 2009). Both predate the 2023 cutoff. [SmartBody](https://www.ifaamas.org/Proceedings/aamas08/proceedings/pdf/paper/AAMAS08_0779.pdf) · [Expressive gaze](https://www.khoury.northeastern.edu/~marsella/publications/pdf/ThiebauxAAMAS09.pdf)
- **HUMANISE**, *Language-conditioned Human Motion Generation in 3D Scenes* (2022). An earlier scene-grounding reference that predates the cutoff. [Paper](https://arxiv.org/abs/2210.09729)

## Decisions behind the final figure

- **X encodes the source of the spatial target.** The five categories are no external target, a target described in language, a supplied ID or coordinate, embodied XR input, and a described target combined with embodied input. “Move here” and “Look here” can share coordinates because the same pointing input supplies the target.
- **Y encodes what sets the timing.** The four categories are no explicit timing constraint, a duration/rate/start time, action order or recorded synchronization, and a runtime condition. A detector observing the character sit is an automatic trigger. A clap named by a director is an authored cue.
- **A coordinate describes the demonstrated example.** A paper can appear more than once. Related pose trackers and automatic controllers have their own marker. A marker shared with a directing example means the axis categories coincide.
- **Real-time labels apply to each placement.** **RT** means the source demonstrates real-time operation or reports real-time controller throughput. **NO** means the source reports no real-time result for that example.
- **Iterative Motion Editing appears at three timing coordinates.** Raising the kick supplies no explicit timing constraint. Speeding up the kick specifies a rate. Guarding the face after the kick specifies action order within an existing clip. The face is body-relative, so all three use the no-external-target column.
- **The proposal’s combined task remains unverified in the selected evidence.** It asks the character to resolve a named prop and a pointed location, then switch gaze on a live cue. The reviewed papers demonstrate parts of that task through scripted gaze, tracked input, or runtime controllers.
