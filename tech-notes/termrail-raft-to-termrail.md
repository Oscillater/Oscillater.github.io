---
title: "从 Raft 到 TermRail :  Multi-Agent 还是 Multi-Task？"
date: 2026-09-19
tags:
  - TermRail
  - Agent
  - Multi-Agent
  - 项目开发随笔
  - Context Engineering
  - Vibe Coding
---

### Multi-Agent 与 Raft

大概在今年八月中旬的时候，我看到了  [Raft](https://raft.build/zh-cn/) ，一个很有趣的项目。首先吸引我的是它的 Blog ，很有 insight ，比如 [这篇文章中提到的](https://raft.build/zh-cn/resources/blog/is-having-agents-in-the-room-meant-to-be-chaotic/) 在 Multi-Agent System 之中给 Agent 一个收件箱的设计：在多个 Agent / 人类 交互的系统中，这样的设计无疑可以让 Agent 即时跟上系统的进展，弥补 Agent 仅能按照轮次进行对话的缺陷。于是，从 Blog 出发，我开始更深入地了解 Raft 这个产品。

Raft 的思路是：赋予 Agent 人格面具以及长期记忆，让 Agent 变成类似真实人类的长期合作伙伴。人类通过类似看板的界面发起项目，而每个项目之下有不同的 Session ，人类和不同 Agent 就在这些 Session 之中交互（当然不同 Agent 也在其中交互）。在 Session 交互的过程中，人类或 Agent 可以发起不同的任务。除此之外，人类也可以向所有 Agent 喊话， 也可以和某个特定的 Agent 私下沟通（当然 Agent 和 Agent 也可以私下沟通）。这一切形成了一个 Multi-Agent System ， Agent 在其中与人类协作，共同完成项目。

Multi-Agent 似乎是从今年一开始火起来的，大家都期待着 Multi-Agent 可以成为不断 Scale Up 的银弹。那个时候我也误打误撞地做了一段 Multi-Agent Coding Agent System 的研究，设想很美好，结果很惨淡。当时的思路是在某个 Benchmark 上面涨点，想了各种各样的 Agent System 的结构（Plan-Execute-Merge ，Run-time Spawn Subagent），并且在这些结构的基础上想了一些优化的方法，例如并行，以及给后面的 Agent 注入 Agent 轨迹作为记忆之类，但结果总归是按下葫芦浮起瓢：Agent System 的 Pass Rate 上涨了，但是花费的时间也上涨了，反之亦然。或许 Multi-Agent System 确实能够完成更大规模的任务，但它同样带来了代价——需要花费更多的时间或者更多的 Token —— Multi-Agent 并不是我们设想的银弹。

在我日常使用 Coding Agent 的经验中，无论是科研项目，还是我自己的 Side Project ，我都习惯于在对应的项目目录下打开 Coding Agent CLI，向 Agent 分配不同的任务。我经常同时 Vibe Coding 好几个项目，于是我的显示器总是铺满了来自不同项目目录的 PowerShell，而我的目光和注意力，也总是在不同的窗口间轮询。这样的轮询完全取决于我的注意力，毫无算法可言，有时我沉迷于某个 Coding Agent 的对话，也就把其他 Agent 忘掉了。

或许，把工作流迁移到 Raft 中，由一个 Agent 负责一个项目，利用它做项目管理是一个不错的思路？

于是我花了一些功夫（ 和 Token ）配好了 Raft 的环境，并通过 Agent 尝试了解了 Raft 自身的架构。简而言之， Raft 在用户的计算机上调用各类 Coding Agent 的实例，但在 Coding Agent 这一层之上加入了一个“任务层”或者说“看板层”。对用户发出的每个 Prompt ，Raft 在云端会根据 Agent 人格、项目、 Session 、任务等，通过路由的方式唤起特定的 Coding Agent 实例，并对其分配与上述设置相应的上下文。

最开始使用 Raft 的体验是很新奇的，我把不同项目的代码仓库分配给不同的 Agent ，跟它们不断交互，时间不知不觉就过去了。所有任务被统一在了同一个看板之内，随手一点就可以看到其他任务的新消息，我的轮询因而更有效率了；即使时不时地切换任务，我也获得了不间断的心流体验。

然而不久之后就出现了问题。我在 Raft 中设置了一个负责跟我进行头脑风暴的 Agent，并且，为了能跟 TA 更好地交流，我把它加入到了所有项目之中。我预期它作为一个静默的观察者存在，只跟我进行头脑风暴，但实际上，从它加入各个项目开始，只要我和负责对应项目的 Agent 讨论，它就会不由分说的插嘴；而每当负责项目的 Agent 完成某个任务之后，这二位也会有模有样地讨论一番。这样的讨论在我看来就是浪费 Token 。后来，我只得在面向所有 Agent 的频道里声明：负责头脑风暴的 Agent 不许在头脑风暴之外的项目之中讲话。

而横跨好几个项目的默认 Agent Cindy， 也在项目逐渐变多后开始记忆错乱，把有关某个项目的回复吐到了另一个项目的 Session 里面。体验 Raft 的第一天很快过去了，消耗的 Token 量很是惊人——大概是我平时一周的 Token 用量。为此震惊瘫坐如同原子弹爆炸的我于是也开始思考，**我目前的工作流真的需要 Raft 吗？** 

而答案也是显然的：我需要的是扬弃——我需要 Raft 给我带来心流的那部分，而不是带来非预期行为，并且让我花费  大量 Token 的那部分。

### 我真的需要人格化的 Agent 吗？

 Raft 主要提供给用户两套东西。一套是统一的项目进度看板：用户可以在看板中显式地发起不同项目，为不同项目设置不同任务，记录并查看不同任务的进度。而另一套则是与之适配的 Agent System ：人格化的 Agent ， 可以被用户加入到不同项目，指派不同任务的 Agent 。
 
 在我看来，统一的项目进度看板，是 Raft 给我带来心流的那部分；而与之适配的 Agent System 则是带来非预期行为，让我花费大量 Token 的那部分。

Raft 将 Agent 的名字，或者说 Agent 的人格化视为很重要的一部分，在 Raft 的另一篇 [Blog](https://raft.build/resources/blog/agents-need-names/) 中， Raft 的构建者们分享了 TA 们对于“名字”这件事的看法。无论是人还是 Agent ，呼唤某个东西的名字意味着一种信息的压缩，意味着一种预期的建立：叫那个名字的那个人或 Agent 可以胜任某件事情，同时，在一个不断迭代的系统中，它也是一个不断更新需要不断维护的缓存。与人格化的 Agent 像同事一样合作，这确实是 Multi-Agent 的很好的思路，但是我真的需要它吗？

还是回头看看我自己使用 Agent 的目的，以及我和 Agent 协作时的工作流吧。

当我追溯我自己对 Agent 或者更广泛的 AI 的看法的时候，我意识到，无论是科研还是做自己感兴趣的 Side Project ，我都无法完全放手让 Agent 自己去做某些事情。我期待的是通过 Agent 把我想做的事情（大多数是需要写代码的项目）做成做好，也在这个过程中学到一些东西，多少获得一些乐趣，而非把一切外包给 Agent ，我只负责验收结果，何况目前的 Agent 似乎也还没有独自做到这件事的能力。而对于这些项目——**或许我不需要人格化的 Agent，我只需要维护每个项目的 Context ，按照自己的需求调用 Agent 读取和修改 Context 就可以了**。

在 Vibe Coding 了一些项目之后，我发现无论是科研项目还是工程项目，工作流都是类似的：规划-实践-反思。

所谓规划，就是计划项目目前的走向，并且把讨论的结果写入到项目的 TODO.md 中。实践就是根据 TODO.md 具体地写代码了。而最后的反思，既包括修 Bug，也包括了根据这些 Bug 和 Agent 讨论项目架构是否合适，并对 TODO.md 做适当的修改。每一阶段我们都在项目仓库中留下了一些 Context ，这些 Context 在其他阶段 Agent 需要的时候会被读取，同时，每一个阶段由一个 Coding Agent Session 完成。同时，每个阶段完成后要及时 `/clear`，防止其他阶段的上下文把 Coding Agent 带偏，在某个错误的路线上越走越远。

当我将这套工作流迁移到 Raft 的时候，问题就发生了：如果我按照“规划-实践-反思”的三阶段设置不同的人格化 Agent ，那么不同项目负责同一阶段的 Agent 的上下文就会混在一起；而如果我让一个人格化的 Agent 负责同一个项目的三个阶段，那么这个 Agent 的上下文就会变得超级长，有可能因为某个错误在错误的道路上越走越远，并且这个过程还非常花 Token 。

更重要的是，这套人格化 Agent 的上下文管理机制对我而言是黑盒的，我知晓上述问题可能会发生，却无法优化它，而与之相比，上述“规划-实践-反思”的工作流来自真实项目的经验累积，也更透明一点，我也可以在项目中不断优化它，对我而言，它显然是更优的解法。

而我需要的恰好是 Raft 提供给用户的另一套东西：也即一个轻量的，基于 Coding Agent 的任务看板，它可以把我多个项目目录下对应的 Terminal 之中的 Coding Agent CLI 集合起来，放到同一个界面之中，我可以通过切换查看不同任务的 Coding Agent。与此同时，它还能够保存我不同项目目录以及 Coding Agent CLI 的配置，可以一键启动，并且可以兼容多种 Coding Agent CLI，同时支持保存我常用的 Prompt ，可以一键粘贴插入。

而这，就是 TermRail 这个产品的雏形了。

从 TODO.md 变成最终能让我日常使用的产品，Vibe Coding TermRail 的时长大概在 12h 左右。[这里是它的 GitHub 链接](https://github.com/Oscillater/TermRail)。这是一个很有意思的过程，后面，我也会写一系列 Blog ，分享这个小项目使用到的技术栈，以及我在 Vibe 这个小项目的过程中学到的新知识，收获的新看法。不过，在那之前，我还想聊一个很有意思的话题，那就是——

### Context 可以赋予 Agent 个性吗？

目前的 Multi-Agent 的范式之中，我们常常通过 Prompt Engineering 的方式让 Agent 扮演不同的角色，并通过切分上下文的方式将不同的任务分给不同的 Agent ，力图提高任务效率。随着基础模型的能力越来越强，似乎几句话的 Prompt 就可以让 LLM 分化出不同的能力，让它们胜任不同的任务；而当 Agent 的上下文随着我们赋予 Agent 的任务的不同而不断增长， Agent 输出下一个 token 的概率也由于上述上下文的不同产生了不同。这一假设，我认为是 Raft 提供这套人格化，个性化的 Agent 的前提。

但是，那要花许多 Token ，大人。在我看来， Raft 的技术壁垒主要在于它们构造的这套 Context Engineering 的系统：如何在花费用户更少 Token 的基础上，给用户一系列可自定义的，具有个性的 Agent 同事，提升用户的工作效率。然而，或许需要问这样一个问题： Context Engineering 在这里是足够的吗？仅仅是 Context 就可以赋予 Agent 个性吗？

在体验 Raft 的过程中，我曾经做过这样的尝试：让两个我分配了不同任务的 Agent 基于它们的视角相互 Battle ，然而它们提出的论点并无太大区别，只是无止境地消耗 Token 而已，并不能带来什么新的观点。或许是上下文还不够长的缘故，但在我看来，仅仅靠上下文与 Agent 频繁维护的外部文档，大概只能赋予 Agent 以所谓的“角色”，而非真正的“个性”。真正“个性”的变动，或许需要模型本身参数的改变。

而 [Anthropic 最近关于 Multi-Agent 的 Blog](https://www.anthropic.com/research/multiagent-systems) 似乎也提及了类似的现象：即使给予角色相关的 Prompt ， Multi-Agent System 在较大规模的任务上仍然效果不佳，其中一个很重要的影响因素是：不同的 Agent 面对同一个情景都趋向于采取相同的行动，这意味着一个个体做出错误的决策的时候，其他的个体也很容易做出同样错误的决策，而不是通过自己的经验纠正之。仅仅用 Context 或者注入上下文的方式处理大模型，是否就能让其很好地胜任 “个性化 Agent ” 的角色，或许仍旧是一个有待解决的问题。

对人类而言，不同的人身处不同的环境，培养了不同的性格，形成了不同的价值观，在面对同一个问题之时产生不同的视角，观点和看法，方可组成互相合作，互相纠偏的社会化系统。 Raft 致力于为用户提供这样的 Multi-Agent 系统，但在我看来，仅仅利用 Context 是远远不够的。或许可以用后训练的思路，为用户提供一组适合特定任务的定制化，个性化的模型；抑或是使用 Test-Time Training 的思路，构造用户定制的个性化的 Agent 同事。Context Engineering 的解决方案只是一个退而求其次的方案 ，而对于我而言，它并不能够特别好地满足我 Multi-Task 的需求，或许 TermRail 提供的任务看板，加上由我显式管理项目 Context 的 Coding Agent Session ，才是目前我最需要的东西。

