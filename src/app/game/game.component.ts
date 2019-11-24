import { Component, OnInit } from '@angular/core';
import { Winner } from 'src/models/winner';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less'],
})
export class GameComponent implements OnInit {
  board: string[] = [];
  humanPlayer: string;
  aiPlayer: string;
  winner: Winner;
  isGameOver = true;

  constructor() {}

  ngOnInit() {}

  private initBoard() {
    this.board = new Array(9).fill(null);
    this.winner = null;
    this.isGameOver = false;
  }

  OnStartGameHuman() {
    this.initBoard();
    this.humanPlayer = 'X';
    this.aiPlayer = 'O';
  }

  OnStartGameAi() {
    this.initBoard();
    this.aiPlayer = 'X';
    this.humanPlayer = 'O';
    this.onMoveAi();
  }

  onMove(index: number) {
    if (this.isGameOver) {
      return;
    }
    if (this.board[index] === null) {
      this.board[index] = this.humanPlayer;
      const winner = this.checkWin(this.board);
      if (winner) {
        this.writeWinner(winner);
      } else {
        this.onMoveAi();
      }
    }
  }

  private onMoveAi() {
    const index = this.minMax(this.board, 0, this.aiPlayer);
    this.board[index] = this.aiPlayer;
    const winner = this.checkWin(this.board);
    if (winner) {
      this.writeWinner(winner);
    }
  }

  minMax(board: string[], depth: number, player: string) {
    const result = this.checkWin(board);
    if (result) {
      if (result.winner === this.humanPlayer) {
        return -100 + depth;
      } else if (result.winner === this.aiPlayer) {
        return 100 - depth;
      } else if (result.winner === 'draw') {
        return 0;
      }
    }

    const moves = [];
    board.forEach((v, i) => {
      if (v === null) {
        const newBoard = [...board];
        newBoard[i] = player;
        const score = this.minMax(
          newBoard,
          depth + 1,
          player === this.humanPlayer ? this.aiPlayer : this.humanPlayer
        );
        moves.push({
          index: i,
          score: score,
        });
      }
    });

    const minOrMax =
      player === this.humanPlayer
        ? Math.min(...moves.map(x => x.score))
        : Math.max(...moves.map(x => x.score));

    const move = moves.find(x => x.score === minOrMax);
    if (depth === 0) {
      return move.index;
    } else {
      return move.score;
    }
  }

  checkWin(board: string[]) {
    if (board[0] === board[1] && board[0] === board[2] && board[0]) {
      return { winner: board[0], cells: [0, 1, 2] };
    }
    if (board[3] === board[4] && board[3] === board[5] && board[3]) {
      return { winner: board[3], cells: [3, 4, 5] };
    }
    if (board[6] === board[7] && board[6] === board[8] && board[6]) {
      return { winner: board[6], cells: [6, 7, 8] };
    }

    if (board[0] === board[3] && board[0] === board[6] && board[0]) {
      return { winner: board[0], cells: [0, 3, 6] };
    }
    if (board[1] === board[4] && board[1] === board[7] && board[1]) {
      return { winner: board[1], cells: [1, 4, 7] };
    }
    if (board[2] === board[5] && board[2] === board[8] && board[2]) {
      return { winner: board[2], cells: [2, 5, 8] };
    }

    if (board[0] === board[4] && board[0] === board[8] && board[0]) {
      return { winner: board[0], cells: [0, 4, 8] };
    }
    if (board[2] === board[4] && board[2] === board[6] && board[2]) {
      return { winner: board[2], cells: [2, 4, 6] };
    }

    if (board.every(cell => cell !== null)) {
      return { winner: 'draw' };
    }
    return false;
  }

  writeWinner(winner) {
    this.isGameOver = true;
    this.winner = winner;
    if (winner.winner === 'draw') {
      this.winner.text = 'It is a draw!';
    } else if (winner.winner === this.aiPlayer) {
      this.winner.text = 'You lost!';
    } else if (winner.winner === this.humanPlayer) {
      // impossible :)
      this.winner.text = 'You won!';
    }
  }
}
